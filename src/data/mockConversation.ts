import type { Message } from '../domain/message';

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
const now = Date.now();
const ago = (ms: number) => now - ms;

/** The conversation from the brief. Ids and text are unchanged; only timestamps are added. */
export const mockConversation: Message[] = [
  {
    id: '1',
    type: 'system',
    text: 'Your session with AI Astrologer has started.',
    createdAt: ago(14 * MINUTE),
  },
  {
    id: '2',
    type: 'user',
    text: 'Can you tell me about my career this year?',
    createdAt: ago(13 * MINUTE),
    status: 'sent',
  },
  {
    id: '3',
    type: 'ai',
    text: 'I can already see a strong Saturn influence in your chart. Based on this, here are a few recommendations that may help you.',
    createdAt: ago(12 * MINUTE),
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
    id: '4',
    type: 'human',
    text: 'I also recommend focusing on your upcoming Jupiter transit.',
    createdAt: ago(3 * MINUTE),
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
        // Not a registered type: renders through FallbackCard.
        { id: 'h2-r1', type: 'meditation', title: 'Moon Meditation', subtitle: '10 minutes before bed' },
        { id: 'h2-r2', type: 'promotion', title: '20% off a sleep reading', subtitle: 'This week only' },
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
