import type { Message } from '../domain/message';

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
const now = Date.now();
const ago = (ms: number) => now - ms;
// The brief's session happened earlier today, before the simulated chat.
const EARLIER = 5 * 60 * MINUTE;

/**
 * The brief's mock payload: the initial state every simulated chat opens with.
 * Text is unchanged; ids are prefixed and timestamps added.
 */
export const briefConversation: Message[] = [
  {
    id: 'brief-1',
    type: 'system',
    text: 'Your session with AI Astrologer has started.',
    createdAt: ago(EARLIER + 14 * MINUTE),
  },
  {
    id: 'brief-2',
    type: 'user',
    text: 'Can you tell me about my career this year?',
    createdAt: ago(EARLIER + 13 * MINUTE),
    status: 'sent',
  },
  {
    id: 'brief-3',
    type: 'ai',
    text: 'I can already see a strong Saturn influence in your chart. Based on this, here are a few recommendations that may help you.',
    createdAt: ago(EARLIER + 12 * MINUTE),
    recommendations: [
      {
        id: '1',
        type: 'gemstone',
        title: 'Blue Sapphire',
        subtitle: 'Recommended for Saturn',
      },
      {
        id: '2',
        type: 'tarot',
        title: 'Career Tarot Reading',
      },
      {
        id: '3',
        type: 'consultation',
        title: 'Talk to an Astrologer',
      },
      {
        id: '4',
        type: 'article',
        title: 'Understanding Saturn Mahadasha',
      },
    ],
  },
  {
    id: 'brief-4',
    type: 'human',
    text: 'I also recommend focusing on your upcoming Jupiter transit.',
    createdAt: ago(EARLIER + 3 * MINUTE),
  },
];

/**
 * Earlier sessions, newest page first. The screen loads one page each time the
 * user scrolls to the top, which is how pagination would work against an API.
 */
export const olderPages: Message[][] = [
  [
    {
      id: 'h2-1',
      type: 'system',
      text: 'Your session with AI Astrologer has started.',
      createdAt: ago(DAY + 40 * MINUTE),
    },
    {
      id: 'h2-2',
      type: 'user',
      text: 'I have been sleeping badly all week. Is something in my chart causing it?',
      createdAt: ago(DAY + 39 * MINUTE),
      status: 'sent',
    },
    {
      id: 'h2-3',
      type: 'user',
      text: 'It started right after the full moon.',
      createdAt: ago(DAY + 38 * MINUTE),
      status: 'sent',
    },
    {
      id: 'h2-4',
      type: 'ai',
      text: 'Your Moon sits in the 12th house, which governs rest. Full moons tend to stir it up. A short evening practice usually helps.',
      createdAt: ago(DAY + 37 * MINUTE),
      recommendations: [
        { id: 'h2-r1', type: 'meditation', title: 'Moon Meditation', subtitle: '10 minutes before bed' },
        // Not in the catalog: renders through FallbackCard instead of crashing.
        { id: 'h2-r2', type: 'journal', title: 'Dream Journal', subtitle: 'Note what wakes you' },
        { id: 'h2-r3', type: 'promotion', title: '20% off a sleep reading', subtitle: 'This week only' },
      ],
      feedback: { rating: 'like' },
    },
  ],
  [
    {
      id: 'h1-1',
      type: 'system',
      text: 'Your session with AI Astrologer has started.',
      createdAt: ago(4 * DAY + 20 * MINUTE),
    },
    {
      id: 'h1-2',
      type: 'user',
      text: 'When is a good time to get married?',
      createdAt: ago(4 * DAY + 19 * MINUTE),
      status: 'sent',
    },
    {
      id: 'h1-3',
      type: 'ai',
      text: 'Venus strengthens in your 7th house from early next year. That window looks the most supportive for commitment.',
      createdAt: ago(4 * DAY + 18 * MINUTE),
    },
    {
      id: 'h1-4',
      type: 'ai',
      text: 'If you want a deeper reading, these are good places to start.',
      createdAt: ago(4 * DAY + 18 * MINUTE),
      recommendations: [
        { id: 'h1-r1', type: 'tarot', title: 'Love & Union Spread' },
        { id: 'h1-r2', type: 'consultation', title: 'Kundli matching call', subtitle: '30 minutes' },
      ],
    },
    {
      id: 'h1-5',
      type: 'human',
      text: 'Happy to go through compatibility with you whenever you are ready.',
      createdAt: ago(4 * DAY + 5 * MINUTE),
    },
  ],
];
