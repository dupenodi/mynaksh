import type { Kundli } from '../../domain/kundli';
import type { Message } from '../../domain/message';

/**
 * The shape of a good session: take details, read the chart, find the problem,
 * go deeper, suggest remedies, talk timing, offer a human, wrap up. Each stage
 * is "done" once the conversation shows it, so the model always knows what to
 * aim for next without a script. Pure, so it is easy to test.
 */

type Progress = {
  hasKundli: boolean;
  /** Card types and widget kinds the astrologer has already shown. */
  shown: Set<string>;
  userTurns: number;
};

type Stage = {
  id: string;
  done: (progress: Progress) => boolean;
  guidance: string;
};

const REMEDY_TYPES = ['gemstone', 'rudraksha', 'yantra', 'mantra', 'remedy', 'meditation', 'puja'];
const shownAny = (progress: Progress, kinds: string[]) => kinds.some((kind) => progress.shown.has(kind));

export const STAGES: Stage[] = [
  {
    id: 'intake',
    done: (p) => p.hasKundli,
    guidance: 'Greet them warmly in one line, then ask for their birth details and show the kundli form.',
  },
  {
    id: 'analysis',
    done: (p) => p.shown.has('analysis'),
    guidance:
      'They have shared their birth details. Give your first reading with the "analysis" widget, then ask what is on their mind, with replies for the usual areas (career, love, health, money).',
  },
  {
    id: 'problem',
    done: (p) => p.userTurns >= 3 || shownAny(p, ['tarot', ...REMEDY_TYPES]),
    guidance:
      'Find the real problem. Ask one caring question about the area they chose, and name the planet or house behind it.',
  },
  {
    id: 'reading',
    done: (p) => p.shown.has('tarot'),
    guidance:
      'Go deeper. Explain what the chart says about their problem, and offer a tarot card. If they ask for cards, draw the spread with the "tarot" widget.',
  },
  {
    id: 'remedies',
    done: (p) => shownAny(p, REMEDY_TYPES),
    guidance:
      'Suggest remedies: 2 or 3 cards from Rituals and Products, each chosen for the planet you named, with "why" and facts filled in. Pick the gemstone from their chart.',
  },
  {
    id: 'timing',
    done: (p) => shownAny(p, ['panchang', 'muhurat']),
    guidance:
      'Talk about timing: a muhurat card for a plan they mentioned, or offer today\'s panchang and show it with the "panchang" widget when they accept.',
  },
  {
    id: 'consultation',
    done: (p) => p.shown.has('consultation'),
    guidance: 'Offer a call with Acharya Meera for the deeper question, with a consultation card. No pressure.',
  },
  {
    id: 'wrapUp',
    done: (p) => p.shown.has('summary'),
    guidance: 'Wrap up warmly: show the "summary" widget and say goodbye in your own voice.',
  },
];

export function progressOf(messages: Message[], kundli: Kundli | null): Progress {
  const shown = new Set<string>();
  let userTurns = 0;
  for (const message of messages) {
    if (message.type === 'user') {
      userTurns++;
    }
    if (message.type === 'ai') {
      message.recommendations?.forEach((card) => shown.add(card.type));
      message.widgets?.forEach((widget) => shown.add(widget.kind));
    }
  }
  return { hasKundli: kundli !== null, shown, userTurns };
}

/** What the model should aim for in its next message. */
export function nextStep(messages: Message[], kundli: Kundli | null): string {
  const progress = progressOf(messages, kundli);
  const stage = STAGES.find((candidate) => !candidate.done(progress));
  const shown = [...progress.shown].filter((kind) => kind !== 'quick_replies' && kind !== 'kundli_form');
  return [
    stage
      ? `Aim for this next: ${stage.guidance}`
      : 'The session is wrapped up. Answer any follow-up briefly and kindly; add UI only if they ask for something.',
    shown.length > 0 ? `Already shown, so do not repeat unless asked: ${shown.join(', ')}.` : null,
  ]
    .filter(Boolean)
    .join('\n');
}
