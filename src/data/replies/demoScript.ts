import { humanAstrologer } from '../../domain/advisors';
import { slotLabel, type ConsultationBooking } from '../../domain/consultation';
import { firstName, sunSign, type Kundli } from '../../domain/kundli';
import type { Message } from '../../domain/message';
import type { DemoLines, Persona } from '../../domain/personas';
import { sampleAnalysis, sampleCards, samplePanchang, sampleSummary, sampleTarot } from '../samples';
import type { ReplyUiPayload } from './protocol';

export type ScriptedReply = { text: string; ui: ReplyUiPayload };

type Topic = {
  matches: RegExp;
  reply: (lines: DemoLines, name: string, kundli: Kundli | null) => ScriptedReply;
};

/** Topics that need a chart before the astrologer can answer them personally. */
const PERSONAL = /career|job|work|exam|love|marri|breakup|partner|money|health|sleep/i;
const ASKING_FOR_READING = /kundli|chart|birth|personal|reading/i;

/**
 * Checked in order; the first match answers. Between them they show every
 * experience, so typing in a simulated chat still demonstrates the whole app.
 */
const TOPICS: Topic[] = [
  {
    matches: /draw|cards|tarot|spread/i,
    reply: () => ({ text: 'Here are your three cards. Turn them over one by one.', ui: { tarot: sampleTarot('What this month holds') } }),
  },
  {
    matches: /panchang|today|auspicious|good time/i,
    reply: (_lines, _name, kundli) => ({
      text: 'Here is today, laid out for you.',
      ui: { panchang: samplePanchang(kundli?.placeOfBirth), cards: [sampleCards.careerMuhurat] },
    }),
  },
  {
    matches: /thank|bye|that.?s all|done for today/i,
    reply: (_lines, name) => ({ text: 'It was good to sit with you. Here is everything in one place.', ui: { summary: sampleSummary(name) } }),
  },
  {
    matches: /career|job|work|exam|boss|money/i,
    reply: (lines, name) => ({
      text: lines.career(name),
      ui: {
        cards: [sampleCards.tarotOffer, sampleCards.blueSapphire, sampleCards.shaniMantra, sampleCards.careerMuhurat],
        replies: ['Draw the cards', 'Tell me about the stone'],
      },
    }),
  },
  {
    matches: /love|marri|breakup|partner|ex\b|trust/i,
    reply: (lines, name) => ({
      text: lines.love(name),
      ui: { cards: [sampleCards.matchCharts, sampleCards.tarotOffer, sampleCards.meeraCall('Love and marriage')] },
    }),
  },
  {
    matches: /health|sleep|stress|tired|stuck/i,
    reply: (lines) => ({
      text: lines.health,
      ui: { cards: [sampleCards.sleepMeditation, sampleCards.chandraMantra, sampleCards.pearl] },
    }),
  },
  {
    matches: /stone|gem|ring|remedy|lucky/i,
    reply: (lines) => ({
      text: lines.gemstone,
      ui: { cards: [sampleCards.blueSapphire, sampleCards.rudraksha, sampleCards.festiveOffer] },
    }),
  },
  {
    matches: /call|human|real astrologer|consult|talk to someone/i,
    reply: () => ({
      text: 'For this, a real person should look at your chart too. Meera is the best I know.',
      ui: { cards: [sampleCards.meeraCall('A full chart reading', 45)] },
    }),
  },
];

/** Picks a scripted reply from the persona's own lines. */
export function scriptedReply(persona: Persona, messages: Message[], kundli: Kundli | null): ScriptedReply {
  const { demo: lines, suggestions } = persona;
  const last = messages[messages.length - 1];

  if (last?.type === 'user' && last.attachment) {
    const shared = last.attachment.kundli;
    const sign = sunSign(shared.dateOfBirth)?.name ?? 'Simha';
    return {
      text: lines.welcomeChart(firstName(shared), sign, shared.placeOfBirth),
      ui: { analysis: sampleAnalysis(sign), replies: suggestions },
    };
  }

  const text = last?.text ?? '';

  if (ASKING_FOR_READING.test(text) || (!kundli && PERSONAL.test(text))) {
    return kundli
      ? { text: lines.haveKundli(firstName(kundli)), ui: { replies: suggestions } }
      : { text: lines.askKundli, ui: { form: 'kundli' } };
  }

  const topic = TOPICS.find(({ matches }) => matches.test(text));
  if (topic) {
    return topic.reply(lines, kundli ? firstName(kundli) : '', kundli);
  }
  return { text: lines.fallback, ui: { replies: suggestions } };
}

/** The human astrologer's hello after a booking in demo mode. */
export function scriptedHumanReply(persona: Persona, kundli: Kundli | null, booking: ConsultationBooking): ScriptedReply {
  const name = kundli ? ` ${firstName(kundli)}` : '';
  return {
    text: `Namaste${name}, I'm ${humanAstrologer.name.split(' ')[1]}. I've read your chat with ${persona.name} about “${booking.focus}”, and I'll call you ${slotLabel(booking.startsAt).toLowerCase()}. Before then, jot down the one decision you most want clarity on.`,
    ui: {},
  };
}
