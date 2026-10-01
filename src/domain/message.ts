import type { Kundli } from './kundli';
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
  | { kind: 'quick_replies'; options: string[] };

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
