import type { Kundli } from './kundli';
import type { ChartAnalysis, Panchang, SessionSummary, TarotSpread } from './readings';
import type { Recommendation } from './recommendation';

type MessageBase = {
  id: string;
  text: string;
  createdAt: number;
};

export type DeliveryStatus = 'sending' | 'sent' | 'failed';

export const DISLIKE_REASONS = ['Inaccurate', 'Too Generic', "Didn't Help", 'Too Long'] as const;
export type DislikeReason = (typeof DISLIKE_REASONS)[number];

export type Feedback =
  | { rating: 'like' }
  | { rating: 'dislike'; reasons: DislikeReason[] };

// A copy of the quoted message, so the quote still shows if the original is deleted.
export type ReplyRef = {
  id: string;
  author: string;
  text: string;
};

export type Attachment = { kind: 'kundli'; kundli: Kundli };

// Interactive UI the astrologer can put under a reply, besides recommendation cards.
export type ReplyWidget =
  | { kind: 'kundli_form' }
  | { kind: 'quick_replies'; options: string[] }
  | { kind: 'analysis'; analysis: ChartAnalysis }
  | { kind: 'tarot'; spread: TarotSpread }
  | { kind: 'panchang'; panchang: Panchang }
  | { kind: 'summary'; summary: SessionSummary };

export type SystemMessage = MessageBase & { type: 'system' };
export type UserMessage = MessageBase & {
  type: 'user';
  status: DeliveryStatus;
  replyTo?: ReplyRef;
  attachment?: Attachment;
};
export type HumanMessage = MessageBase & { type: 'human' };
export type AiMessage = MessageBase & {
  type: 'ai';
  recommendations?: Recommendation[];
  widgets?: ReplyWidget[];
  feedback?: Feedback;
  isStreaming?: boolean;
};

export type Message = SystemMessage | UserMessage | HumanMessage | AiMessage;

const DEFAULT_AUTHORS: Record<Message['type'], string> = {
  user: 'You',
  system: 'MyNaksh',
  ai: 'Astrologer',
  human: 'Astrologer',
};

/** Snapshot used by the composer preview and quoted bubbles. */
export function toReplyRef(message: Message, authors?: Partial<Record<Message['type'], string>>): ReplyRef {
  const names = { ...DEFAULT_AUTHORS, ...authors };
  return { id: message.id, author: names[message.type], text: message.text };
}
