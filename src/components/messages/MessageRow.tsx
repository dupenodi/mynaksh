import { memo } from 'react';

import { AdvisorMessage } from './AdvisorMessage';
import { DaySeparator } from './DaySeparator';
import { SystemNote } from './SystemNote';
import type { MessageRowProps } from './types';
import { UserBubble } from './UserBubble';

export type { MessageActions, MessageLayout, MessageRowProps } from './types';
export { DaySeparator };

// memo: a row re-renders only when its own props change, not on every new message.
export const MessageRow = memo(function MessageRow({
  message,
  layout,
  persona,
  kundli,
  savedKundli,
  actions,
}: MessageRowProps) {
  switch (message.type) {
    case 'system':
      return <SystemNote text={message.text} />;
    case 'user':
      return <UserBubble message={message} layout={layout} actions={actions} />;
    case 'ai':
    case 'human':
      return (
        <AdvisorMessage
          message={message}
          layout={layout}
          persona={persona}
          kundli={kundli}
          savedKundli={savedKundli}
          actions={actions}
        />
      );
  }
});
