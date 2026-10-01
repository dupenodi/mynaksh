import { Copy, Reply, RotateCw, Trash2, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Message } from '../../domain/message';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Sheet } from '../Sheet';

export type MessageAction = 'reply' | 'copy' | 'retry' | 'delete';

type Props = {
  message: Message | null;
  onClose: () => void;
  onAction: (action: MessageAction, message: Message) => void;
};

export function MessageActionsSheet({ message, onClose, onAction }: Props) {
  const actions: { action: MessageAction; label: string; Icon: LucideIcon; danger?: boolean }[] = [
    { action: 'reply', label: 'Reply', Icon: Reply },
    { action: 'copy', label: 'Copy text', Icon: Copy },
  ];
  if (message?.type === 'user' && message.status === 'failed') {
    actions.push({ action: 'retry', label: 'Retry sending', Icon: RotateCw });
  }
  actions.push({ action: 'delete', label: 'Delete message', Icon: Trash2, danger: true });

  return (
    <Sheet visible={message !== null} onClose={onClose}>
      {message ? (
        <>
          <View style={styles.preview}>
            <Text style={styles.previewText} numberOfLines={3}>
              {message.text}
            </Text>
          </View>
          <View style={styles.list}>
            {actions.map(({ action, label, Icon, danger }, index) => (
              <Pressable
                key={action}
                onPress={() => onAction(action, message)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.row, index > 0 && styles.divider, pressed && styles.rowPressed]}
              >
                <Icon size={19} color={danger ? colors.danger : colors.text} strokeWidth={1.75} />
                <Text style={[styles.label, danger && styles.danger]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  preview: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    borderRadius: 18,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    backgroundColor: colors.surfaceRaised,
  },
  previewText: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  list: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.surfaceRaised,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  rowPressed: {
    backgroundColor: colors.line,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  danger: {
    color: colors.danger,
  },
});
