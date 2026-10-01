import { CircleAlert, RotateCw } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { UserMessage } from '../../domain/message';
import { timeLabel } from '../../state/timeline';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { KundliCard } from '../kundli/KundliCard';
import type { MessageRowProps } from './MessageRow';
import { SwipeToReply } from './SwipeToReply';

const statusText: Record<UserMessage['status'], string> = {
  sending: 'Sending',
  sent: 'Sent',
  failed: 'Not sent',
};

export function UserBubble({
  message,
  startsGroup,
  endsGroup,
  selected,
  onLongPress,
  onAction,
  onRetry,
}: MessageRowProps & { message: UserMessage }) {
  const failed = message.status === 'failed';
  const showMeta = endsGroup || message.status !== 'sent';
  const bubbleRef = useRef<View>(null);

  const openMenu = () =>
    bubbleRef.current?.measureInWindow((x, y, width, height) => onLongPress(message, { x, y, width, height }));

  return (
    <SwipeToReply
      onReply={() => onAction('reply', message)}
      style={showMeta ? styles.groupEnd : styles.groupGap}
      contentStyle={styles.row}
    >
      <Pressable
        ref={bubbleRef}
        onLongPress={openMenu}
        delayLongPress={350}
        accessibilityHint="Swipe right to reply. Long press for more."
        style={({ pressed }) => [
          styles.bubble,
          !startsGroup && styles.joined,
          !endsGroup && styles.continues,
          message.status === 'sending' && styles.sending,
          failed && styles.failed,
          (pressed || selected) && styles.pressed,
        ]}
      >
        {message.replyTo ? (
          <View style={styles.quote}>
            <Text style={styles.quoteAuthor}>{message.replyTo.author}</Text>
            <Text style={styles.quoteText} numberOfLines={2}>
              {message.replyTo.text}
            </Text>
          </View>
        ) : null}
        {message.attachment?.kind === 'kundli' ? <KundliCard kundli={message.attachment.kundli} /> : null}
        <Text style={styles.text}>{message.text}</Text>
      </Pressable>

      {showMeta ? (
        <View style={styles.metaRow}>
          {failed ? (
            <>
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
            </>
          ) : (
            <>
              <Text style={styles.meta}>{timeLabel(message.createdAt)}</Text>
              <Text style={styles.meta}>{statusText[message.status]}</Text>
            </>
          )}
        </View>
      ) : null}
    </SwipeToReply>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-end',
  },
  groupGap: {
    marginBottom: 4,
  },
  groupEnd: {
    marginBottom: 22,
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
