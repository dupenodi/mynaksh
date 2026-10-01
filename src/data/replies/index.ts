import { demoReply } from './demoReplies';
import { liveReply } from './liveReplies';
import type { ReplySource } from './protocol';

export type Mode = 'demo' | 'live';

// The store picks a source by mode. The UI never knows which one answered.
export const replySources: Record<Mode, ReplySource> = {
  demo: demoReply,
  live: liveReply,
};

export { parseReply, visibleText } from './protocol';
