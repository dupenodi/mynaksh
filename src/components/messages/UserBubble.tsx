import { CircleAlert, RotateCw } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { UserMessage } from '../../domain/message';
import { timeLabel } from '../../state/timeline';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { KundliCard } from '../kundli/KundliCard';
import { LONG_PRESS_MS, USER_GROUP_END, USER_GROUP_GAP } from './spacing';
import { SwipeToReply } from './SwipeToReply';
import type { MessageActions, MessageLayout } from './types';
import { useMenuAnchor } from './useMenuAnchor';

const statusText: Record<UserMessage['status'], string> = {
  sending: 'Sending…',
  sent: 'Sent',
  failed: 'Failed',
};

type Props = {
  message: UserMessage;
  layout: MessageLayout;
  actions: MessageActions;
};

export function UserBubble({ message, layout, actions }: Props) {
  const failed = message.status === 'failed';
  const showMeta = layout.endsGroup || message.status !== 'sent';
  const { ref, open } = useMenuAnchor(message, actions.onLongPress);

  return (
    <SwipeToReply
      onReply={() => actions.onAction('reply', message)}
      style={showMeta ? styles.groupEnd : styles.groupGap}
      contentStyle={styles.row}
    >
      <Pressable
        ref={ref}
        onLongPress={open}
        delayLongPress={LONG_PRESS_MS}
        accessibilityHint="Swipe right to reply. Long press for more."
        style={({ pressed }) => [
          styles.bubble,
          !layout.startsGroup && styles.joined,
          !layout.endsGroup && styles.continues,
          message.status === 'sending' && styles.sending,
          failed && styles.failed,
          (pressed || layout.selected) && styles.pressed,
        ]}
      >
        {message.replyTo ? <Quote author={message.replyTo.author} text={message.replyTo.text} /> : null}
        {message.attachment?.kind === 'kundli' ? <KundliCard kundli={message.attachment.kundli} /> : null}
        <Text style={styles.text}>{message.text}</Text>
      </Pressable>

      {showMeta ? <DeliveryMeta message={message} onRetry={actions.onRetry} /> : null}
    </SwipeToReply>
  );
}

function Quote({ author, text }: { author: string; text: string }) {
  return (
    <View style={styles.quote}>
      <Text style={styles.quoteAuthor}>{author}</Text>
      <Text style={styles.quoteText} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

function DeliveryMeta({ message, onRetry }: { message: UserMessage; onRetry: (id: string) => void }) {
  if (message.status === 'failed') {
    return (
      <View style={styles.metaRow}>
        <CircleAlert size={13} color={colors.danger} strokeWidth={2} />
        <Text style={[styles.meta, styles.failedMeta]}>{statusText.failed}</Text>
        <Pressable
          onPress={() => onRetry(message.id)}
          accessibilityRole="button"
          hitSlop={8}
          style={({ pressed }) => [styles.retry, pressed && { opacity: 0.7 }]}
        >
          <RotateCw size={12} color={colors.danger} strokeWidth={2} />
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.metaRow}>
      <Text style={styles.meta}>{timeLabel(message.createdAt)}</Text>
      <Text style={styles.meta}>{statusText[message.status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-end',
  },
  groupGap: {
    marginBottom: USER_GROUP_GAP,
  },
  groupEnd: {
    marginBottom: USER_GROUP_END,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: colors.paper,
  },
  joined: {
    borderTopRightRadius: 6,
  },
  continues: {
    borderBottomRightRadius: 6,
  },
  sending: {
    opacity: 0.6,
  },
  failed: {
    backgroundColor: colors.dangerTint,
  },
  pressed: {
    backgroundColor: colors.paperPressed,
    transform: [{ scale: 0.985 }],
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
  quote: {
    marginBottom: 8,
    paddingLeft: 10,
    paddingVertical: 2,
    borderLeftWidth: 2,
    borderLeftColor: colors.brand,
  },
  quoteAuthor: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.brand,
  },
  quoteText: {
    marginTop: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.faint,
  },
  failedMeta: {
    marginLeft: -3,
    fontFamily: fonts.medium,
    color: colors.danger,
  },
  retry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.dangerLine,
  },
  retryText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.danger,
  },
});
