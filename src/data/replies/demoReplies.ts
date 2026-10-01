import { sunSign, type Kundli } from '../../domain/kundli';
import type { Message } from '../../domain/message';
import type { Persona } from '../../domain/personas';
import { isOnline, OfflineError } from '../network';
import { UI_MARKER, type ReplySource } from './protocol';

type Ui = {
  cards?: { type: string; title: string; subtitle?: string }[];
  form?: 'kundli';
  replies?: string[];
};

type Reply = [text: string, ui: Ui];

const firstName = (kundli: Kundli) => kundli.name.split(' ')[0];

/**
 * Picks a scripted reply from the persona's own lines. Topics decide which UI
 * shows up, so demo mode exercises the form, cards and quick replies.
 */
function scriptedReply(persona: Persona, messages: Message[], kundli: Kundli | null): Reply {
  const { demo, suggestions } = persona;
  const last = messages[messages.length - 1];

  if (last?.type === 'user' && last.attachment) {
    const shared = last.attachment.kundli;
    const sign = sunSign(shared.dateOfBirth)?.name ?? 'a strong sign';
    return [demo.welcomeChart(firstName(shared), sign, shared.placeOfBirth), { replies: suggestions }];
  }

  const text = last?.text ?? '';
  const askingForReading = /kundli|chart|birth|personal|reading/i.test(text);

  if (askingForReading || (!kundli && /career|job|work|exam|love|marri|breakup|partner/i.test(text))) {
    return kundli ? [demo.haveKundli(firstName(kundli)), { replies: suggestions }] : [demo.askKundli, { form: 'kundli' }];
  }

  const name = kundli ? firstName(kundli) : '';

  if (/career|job|work|exam|boss|money/i.test(text)) {
    return [
      demo.career(name),
      {
        cards: [
          { type: 'tarot', title: 'Career Tarot Reading' },
          { type: 'gemstone', title: 'Blue Sapphire', subtitle: 'Recommended for Saturn' },
          { type: 'remedy', title: 'Saturday Remedy', subtitle: 'Sesame oil diya' },
        ],
        replies: ['When does it improve?', 'Tell me about the remedy'],
      },
    ];
  }
  if (/love|marri|breakup|partner|ex\b|trust/i.test(text)) {
    return [
      demo.love(name),
      {
        cards: [
          { type: 'tarot', title: 'Love & Union Spread' },
          { type: 'consultation', title: 'Kundli matching call', subtitle: '30 minutes' },
        ],
      },
    ];
  }
  if (/health|sleep|stress|tired|stuck/i.test(text)) {
    return [
      demo.health,
      {
        cards: [
          { type: 'panchang', title: 'Today’s Panchang', subtitle: 'Good hours for rest' },
          { type: 'meditation', title: 'Moon Meditation', subtitle: '10 minutes before bed' },
        ],
      },
    ];
  }
  if (/stone|gem|ring|remedy|lucky/i.test(text)) {
    return [
      demo.gemstone,
      {
        cards: [
          { type: 'gemstone', title: 'Blue Sapphire', subtitle: 'Recommended for Saturn' },
          { type: 'promotion', title: '15% off certified stones', subtitle: 'Ends Sunday' },
        ],
      },
    ];
  }
  return [demo.fallback, { replies: suggestions }];
}

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('Aborted'));
    });
  });

// Streams the scripted text a few characters at a time, like the live source.
export const demoReply: ReplySource = async ({ persona, messages, kundli, signal, onOpen, onText }) => {
  await wait(450, signal);
  if (!isOnline()) {
    throw new OfflineError();
  }
  onOpen();
  await wait(900, signal);

  const [text, ui] = scriptedReply(persona, messages, kundli);
  const raw = Object.keys(ui).length > 0 ? `${text}\n${UI_MARKER}${JSON.stringify(ui)}` : text;

  for (let end = 4; end < text.length; end += 4) {
    onText(raw.slice(0, end));
    await wait(18, signal);
  }
  onText(raw);
  return raw;
};
