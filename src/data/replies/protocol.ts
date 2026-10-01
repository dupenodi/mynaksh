import type { Kundli } from '../../domain/kundli';
import type { Message, ReplyWidget } from '../../domain/message';
import type { Persona } from '../../domain/personas';
import type { Recommendation } from '../../domain/recommendation';

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

export type ReplyRequest = {
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

export function visibleText(raw: string): string {
  return raw.split('⟦')[0].trimEnd();
}

const isString = (value: unknown): value is string => typeof value === 'string' && value.length > 0;

export function parseReply(raw: string, idPrefix: string): ParsedReply {
  const [text, json] = raw.split(UI_MARKER);
  const reply: ParsedReply = { text: text.trim(), recommendations: [], widgets: [] };

  let ui: Record<string, unknown> = {};
  try {
    ui = JSON.parse(json?.match(/\{[\s\S]*\}/)?.[0] ?? '{}');
  } catch {
    return reply;
  }

  if (Array.isArray(ui.cards)) {
    reply.recommendations = ui.cards
      .filter((card) => isString(card?.type) && isString(card?.title))
      .slice(0, 4)
      .map((card, index) => ({
        id: `${idPrefix}-${index}`,
        type: card.type,
        title: card.title,
        subtitle: isString(card.subtitle) ? card.subtitle : undefined,
      }));
  }
  if (ui.form === 'kundli') {
    reply.widgets.push({ kind: 'kundli_form' });
  }
  if (Array.isArray(ui.replies)) {
    const options = ui.replies.filter(isString).slice(0, 3);
    if (options.length > 0) {
      reply.widgets.push({ kind: 'quick_replies', options });
    }
  }
  return reply;
}
