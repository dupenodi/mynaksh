import { humanAstrologer } from '../../domain/advisors';
import { slotLabel, type ConsultationBooking } from '../../domain/consultation';
import { describeKundli, type Kundli } from '../../domain/kundli';
import type { Message } from '../../domain/message';
import type { Persona } from '../../domain/personas';
import { imageKeys } from '../../media/imageSets';
import { experiencesByGroup } from '../../recommendations/catalog';
import type { Experience } from '../../recommendations/types';
import { widgetPromptLines } from '../../widgets/definitions';
import { nextStep } from './arc';
import { encodeParsed, MAX_CARDS, UI_MARKER } from './protocol';

/** How many recent messages the model sees. */
const CONTEXT_MESSAGES = 24;

export type ChatTurn = { role: 'system' | 'user' | 'assistant'; content: string };

// Shared by every persona, so all of them sound like real people.
const HOUSE_RULES = `You are an astrologer inside the MyNaksh app.

How to talk:
- Like a real person texting. Usually 1 to 3 short sentences. No lists, no headings, no markdown.
- Sound like a person first and a character second. Use your catchphrases sparingly, never several in a row.
- If someone is hurting, comfort them first. Ask for details only after that.
- Ask one question at a time. Use the person's first name once you know it.
- Never copy the example lines word for word. They only show the tone.
- Astrology shows tendencies. Never promise medical, legal or money outcomes.`;

const SESSION_SHAPE = `How a session goes (a direction, not a script; if they ask for something, answer that first):
1. Greet, then take their birth details. 2. First reading of the chart. 3. Find what is troubling them.
4. Go deeper (the planet behind it, a tarot spread). 5. Remedies chosen for that planet.
6. Timing (muhurat, panchang). 7. Offer a call with the human astrologer. 8. Wrap up with a summary.
Show one new kind of UI per message at most, so each one gets its moment.`;

// Last in the prompt, where it is most likely to be followed.
const FORMAT_REMINDER = `Before you reply: always start with 1 to 3 short sentences in your own voice, no lists, and never a message with only UI. Put any UI only after ${UI_MARKER} at the very end of the message, as raw JSON. Never write JSON or code fences in your words, and write nothing after the JSON.`;

function describeType(experience: Experience): string {
  const parts = [`${experience.type}: ${experience.hint}`];
  if (experience.imageSet) {
    parts.push(`"image": one of ${imageKeys(experience.imageSet).join(', ')}`);
  }
  if (experience.fields) {
    parts.push(experience.fields);
  }
  return `    - ${parts.join('. ')}`;
}

/** The card types by group, with what each one needs. Generated from the catalog, so new types appear automatically. */
function cardGuide(): string {
  return experiencesByGroup()
    .filter(({ experiences }) => experiences.length > 0)
    .map(({ group, experiences }) => `  ${group.label} (${group.purpose}):\n${experiences.map(describeType).join('\n')}`)
    .join('\n');
}

function uiGuide(): string {
  const lines = [
    `"cards": up to ${MAX_CARDS} items of {"type", "title" (under 32 characters), "subtitle", "why": one or two sentences on why it suits them, "facts": 2 to 4 {"label","value"}, plus any fields listed for the type}. Make every value specific to this person; never reuse an example. Types by group:\n${cardGuide()}`,
    ...widgetPromptLines(),
  ];
  return `You can show UI under your message. When it helps, end your message with a new line, then ${UI_MARKER} and one JSON object (valid JSON, double quotes) using any of these keys:
${lines.map((line) => `- ${line}`).join('\n')}`;
}

function today(): string {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function systemPrompt(persona: Persona, kundli: Kundli | null, messages: Message[]): string {
  const chart = kundli ? `Their birth details:\n${describeKundli(kundli)}` : 'You do not have their birth details yet.';
  return [
    persona.voice,
    HOUSE_RULES,
    `Today is ${today()}.`,
    chart,
    SESSION_SHAPE,
    uiGuide(),
    `Where this session is now:\n${nextStep(messages, kundli)}`,
    FORMAT_REMINDER,
  ].join('\n\n');
}

function toTurn(message: Message): ChatTurn | null {
  switch (message.type) {
    case 'user': {
      if (message.status === 'failed') {
        return null;
      }
      const quote = message.replyTo ? `(replying to "${message.replyTo.text}") ` : '';
      const chart = message.attachment ? `\n${describeKundli(message.attachment.kundli)}` : '';
      return { role: 'user', content: quote + message.text + chart };
    }
    case 'ai':
      // Exactly as it was written, UI included: the model sees what it already showed,
      // and every past turn is another example of the right format.
      return { role: 'assistant', content: encodeParsed({ text: message.text, recommendations: message.recommendations, widgets: message.widgets ?? [] }) };
    case 'human':
      return { role: 'assistant', content: `(${humanAstrologer.name}, human astrologer) ${message.text}` };
    case 'system':
      return { role: 'user', content: `(App note: ${message.text})` };
  }
}

export function toChatTurns(persona: Persona, messages: Message[], kundli: Kundli | null): ChatTurn[] {
  const history = messages
    .slice(-CONTEXT_MESSAGES)
    .map(toTurn)
    .filter((turn) => turn !== null);
  // The stage note is repeated on the latest user turn, where models weigh it most.
  const last = history.at(-1);
  if (last?.role === 'user') {
    history[history.length - 1] = { ...last, content: `${last.content}\n\n(App note for the astrologer, not from the user: ${nextStep(messages, kundli)})` };
  }
  return [{ role: 'system', content: systemPrompt(persona, kundli, messages) }, ...history];
}

function transcript(persona: Persona, messages: Message[]): string {
  const speaker = (message: Message) =>
    ({ user: 'User', ai: persona.name, human: humanAstrologer.name, system: 'App' })[message.type];
  return messages
    .slice(-CONTEXT_MESSAGES)
    .filter((message) => message.text)
    .map((message) => `${speaker(message)}: ${message.text}`)
    .join('\n');
}

/** The human astrologer joining after a booking: her own voice, no UI, one short hello. */
export function toHumanTurns(
  persona: Persona,
  messages: Message[],
  kundli: Kundli | null,
  booking: ConsultationBooking,
): ChatTurn[] {
  const system = `You are ${humanAstrologer.name}, a warm, experienced and verified ${humanAstrologer.role.toLowerCase()} on MyNaksh. You are a real person, not an AI.
The user just booked a ${booking.minutes}-minute call with you about "${booking.focus}" for ${slotLabel(booking.startsAt)}. You are joining their chat with ${persona.name}, an AI astrologer, to say hello before the call.
Write one short message (2 or 3 sentences, under 60 words, plain text, no UI): greet them by first name if known, show you read the chat by naming one specific thing from it, confirm the time, and ask one question to prepare for the call.
${kundli ? `Their birth details:\n${describeKundli(kundli)}` : ''}`;
  return [
    { role: 'system', content: system },
    { role: 'user', content: `The chat so far:\n${transcript(persona, messages)}` },
  ];
}
