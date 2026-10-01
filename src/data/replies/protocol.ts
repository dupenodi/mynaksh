import type { ConsultationBooking } from '../../domain/consultation';
import type { Kundli } from '../../domain/kundli';
import type { Message, ReplyWidget } from '../../domain/message';
import type { Persona } from '../../domain/personas';
import type { Fact, Recommendation } from '../../domain/recommendation';
import { encodeWidgets, parseWidgets, type ReplyUi } from '../../widgets/definitions';

/**
 * Both reply sources return plain text in the same shape:
 *
 *   The answer, as normal sentences.
 *   ⟦UI⟧{"cards":[…],"form":"kundli","replies":["…"]}
 *
 * Everything after the marker is optional JSON describing UI to show under the
 * message. Keeping it in one string means the same parser works while
 * streaming (hide the JSON) and at the end (turn it into cards and widgets).
 */
export const UI_MARKER = '⟦UI⟧';

export const MAX_CARDS = 4;

/** Who writes the reply: the AI persona, or the human astrologer joining after a booking. */
export type Speaker = { kind: 'persona' } | { kind: 'human'; booking: ConsultationBooking };

export type ReplyRequest = {
  speaker: Speaker;
  persona: Persona;
  messages: Message[];
  kundli: Kundli | null;
  signal: AbortSignal;
  onOpen: () => void;
  onText: (raw: string) => void;
};

export type ReplySource = (request: ReplyRequest) => Promise<string>;

export type ParsedReply = {
  text: string;
  recommendations: Recommendation[];
  widgets: ReplyWidget[];
};

/** The UI object a source writes after the marker. Widgets add their own keys (see widgets/definitions). */
export type ReplyUiPayload = {
  cards?: Omit<Recommendation, 'id'>[];
} & Record<string, unknown>;

export function encodeReply(text: string, ui: ReplyUiPayload = {}): string {
  return Object.keys(ui).length > 0 ? `${text}\n${UI_MARKER}${JSON.stringify(ui)}` : text;
}

// Where UI starts in a reply: the marker, or (when a model forgets it) a code fence or a line opening a JSON object.
const UI_START = /⟦|```|^\s*\{/m;

/** What to show while a reply streams: everything before the UI starts. */
/** A parsed reply back in the raw format, e.g. to show the model its own earlier turn exactly as written. */
export function encodeParsed({ text, recommendations, widgets }: Omit<ParsedReply, 'recommendations'> & {
  recommendations?: Recommendation[];
}): string {
  const cards = (recommendations ?? []).map(({ id: _id, ...card }) => card);
  return encodeReply(text, { ...(cards.length > 0 ? { cards } : {}), ...encodeWidgets(widgets) });
}

export function visibleText(raw: string): string {
  const start = raw.search(UI_START);
  return (start === -1 ? raw : raw.slice(0, start)).trimEnd();
}

/**
 * Splits the reply into its text and its UI JSON. Models sometimes skip the
 * marker and write the JSON in a code fence or at the end, so those are
 * recovered too, and any text after a fence is kept.
 */
function splitUi(raw: string): { text: string; json?: string } {
  if (raw.includes(UI_MARKER)) {
    const [text, json] = raw.split(UI_MARKER);
    return { text, json };
  }
  const fenced = raw.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (fenced?.index !== undefined) {
    const text = `${raw.slice(0, fenced.index).trimEnd()}\n\n${raw.slice(fenced.index + fenced[0].length).trimStart()}`;
    return { text, json: fenced[1] };
  }
  const trailing = raw.match(/\n\s*(\{[\s\S]*\})\s*$/);
  if (trailing?.index !== undefined) {
    return { text: raw.slice(0, trailing.index), json: trailing[1] };
  }
  return { text: raw };
}

const isText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const MAX_FACTS = 5;

/** Accepts [{label, value}] or a plain {label: value} map, since models write both. */
function parseFacts(value: unknown): Fact[] | undefined {
  const pairs = Array.isArray(value)
    ? value.filter(isRecord).map((item) => [item.label, item.value])
    : isRecord(value)
      ? Object.entries(value)
      : [];
  const facts = pairs
    .filter((pair): pair is [string, string | number] => isText(pair[0]) && (isText(pair[1]) || typeof pair[1] === 'number'))
    .map(([label, factValue]) => ({ label, value: String(factValue) }))
    .slice(0, MAX_FACTS);
  return facts.length > 0 ? facts : undefined;
}

function parseCard(card: Record<string, unknown>, id: string): Recommendation | undefined {
  const { type, title, subtitle, image, why, facts, extra, ...rest } = card;
  if (!isText(type) || !isText(title)) {
    return undefined;
  }
  // Type-specific fields sometimes land at the top level instead of under "extra"; keep both.
  const merged = { ...rest, ...(isRecord(extra) ? extra : {}) };
  return {
    id,
    type,
    title,
    subtitle: isText(subtitle) ? subtitle : undefined,
    image: isText(image) ? image : undefined,
    why: isText(why) ? why : undefined,
    facts: parseFacts(facts),
    extra: Object.keys(merged).length > 0 ? merged : undefined,
  };
}

function parseCards(ui: ReplyUi, idPrefix: string): Recommendation[] {
  if (!Array.isArray(ui.cards)) {
    return [];
  }
  return ui.cards
    .filter(isRecord)
    .map((card, index) => parseCard(card, `${idPrefix}-${index}`))
    .filter((card) => card !== undefined)
    .slice(0, MAX_CARDS);
}

/** Bad or missing JSON just means no extra UI. */
export function parseReply(raw: string, idPrefix: string): ParsedReply {
  const { text, json } = splitUi(raw);
  const reply: ParsedReply = { text: text.trim(), recommendations: [], widgets: [] };

  let ui: ReplyUi;
  try {
    ui = JSON.parse(json?.match(/\{[\s\S]*\}/)?.[0] ?? '{}');
  } catch {
    return reply;
  }

  reply.recommendations = parseCards(ui, idPrefix);
  reply.widgets = parseWidgets(ui);
  return reply;
}
