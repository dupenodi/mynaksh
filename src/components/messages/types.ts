import type { Kundli } from '../../domain/kundli';
import type { DislikeReason, Feedback, Message } from '../../domain/message';
import type { Persona } from '../../domain/personas';
import type { Recommendation } from '../../domain/recommendation';
import type { MessageAction, MessageAnchor } from './MessageMenu';

export type MessageLayout = {
  startsGroup: boolean;
  endsGroup: boolean;
  isLatest: boolean;
  /** The message whose menu is open, drawn highlighted. */
  selected: boolean;
};

export type MessageActions = {
  onLongPress: (message: Message, anchor: MessageAnchor) => void;
  onAction: (action: MessageAction, message: Message) => void;
  onRecommendationPress: (recommendation: Recommendation) => void;
  onRate: (id: string, rating: Feedback['rating']) => void;
  onToggleReason: (id: string, reason: DislikeReason) => void;
  onRetry: (id: string) => void;
  onQuickReply: (text: string) => void;
  onSubmitKundli: (kundli: Kundli) => void;
  onEditKundli: () => void;
};

export type MessageRowProps = {
  message: Message;
  layout: MessageLayout;
  persona: Persona;
  kundli: Kundli | null;
  savedKundli: Kundli | null;
  actions: MessageActions;
};
