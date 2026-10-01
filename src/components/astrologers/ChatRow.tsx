import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Mode } from '../../data/replies';
import type { Message } from '../../domain/message';
import type { Persona } from '../../domain/personas';
import { useLastMessage } from '../../state/selectors';
import { shortTimeLabel } from '../../state/timeline';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { Avatar } from '../Avatar';

type Props = {
  persona: Persona;
  mode: Mode;
  onPress: () => void;
  /** Live rows hide until the conversation has a message. */
  hideWhenEmpty?: boolean;
};

function previewText(last: Message | undefined, greeting: string): string {
  if (!last) {
    return greeting;
  }
  return `${last.type === 'user' ? 'You: ' : ''}${last.text}`;
}

export function ChatRow({ persona, mode, onPress, hideWhenEmpty = false }: Props) {
  const last = useLastMessage(persona.id, mode);
  if (hideWhenEmpty && !last) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${mode === 'live' ? 'Live chat' : 'Simulated chat'} with ${persona.name}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Avatar source={persona.avatar} size={52} online />

      <View style={styles.body}>
        <View style={styles.line}>
          <Text style={styles.name} numberOfLines={1}>
            {persona.name}
          </Text>
          <Text style={[styles.time, !last && styles.timeUnread]}>{last ? shortTimeLabel(last.createdAt) : 'New'}</Text>
        </View>
        <View style={styles.line}>
          <Text style={[styles.preview, !last && styles.previewUnread]} numberOfLines={1}>
            {previewText(last, persona.quote)}
          </Text>
          {!last ? (
            <View style={styles.unread}>
              <Text style={styles.unreadText}>1</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {persona.title} · ★ {persona.stats.rating.toFixed(1)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pressed: {
    backgroundColor: colors.surface,
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
  },
  time: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.faint,
  },
  timeUnread: {
    fontFamily: fonts.medium,
    color: colors.brand,
  },
  preview: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
  },
  previewUnread: {
    color: colors.text,
  },
  unread: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
  unreadText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.onAccent,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.faint,
  },
});
