import { ArrowUp, Plus, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ReplyRef } from '../domain/message';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { IconButton } from './Button';
import { CONTENT_MAX_WIDTH } from './layout';

type ComposerProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
  replyingTo: ReplyRef | null;
  onCancelReply: () => void;
  onAttachPress: () => void;
  hasKundli: boolean;
  placeholder: string;
};

export function Composer({
  onSend,
  disabled = false,
  replyingTo,
  onCancelReply,
  onAttachPress,
  hasKundli,
  placeholder,
}: ComposerProps) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [draft, setDraft] = useState('');
  const canSend = !disabled && draft.trim().length > 0;

  // Choosing "Reply" focuses the input so the user can type straight away.
  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus();
    }
  }, [replyingTo]);

  const send = () => {
    if (!canSend) {
      return;
    }
    onSend(draft.trim());
    setDraft('');
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.column}>
        {replyingTo ? (
          <Animated.View entering={FadeInDown.duration(200)} exiting={FadeOutDown.duration(150)} style={styles.reply}>
            <View style={styles.replyBody}>
              <Text style={styles.replyLabel}>Replying to {replyingTo.author}</Text>
              <Text style={styles.replyText} numberOfLines={1}>
                {replyingTo.text}
              </Text>
            </View>
            <IconButton onPress={onCancelReply} accessibilityLabel="Cancel reply" size={28}>
              <X size={14} color={colors.muted} strokeWidth={2} />
            </IconButton>
          </Animated.View>
        ) : null}

        <View style={styles.field}>
          <View>
            <IconButton
              onPress={onAttachPress}
              accessibilityLabel={hasKundli ? 'Edit your birth details' : 'Share your birth details'}
              size={38}
            >
              <Plus size={20} color={colors.accent} strokeWidth={1.75} />
            </IconButton>
            {hasKundli ? <View style={styles.attachDot} /> : null}
          </View>
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={send}
            placeholder={placeholder}
            placeholderTextColor={colors.faint}
            style={styles.input}
            returnKeyType="send"
            submitBehavior="submit"
            accessibilityLabel="Message"
          />
          <IconButton
            onPress={send}
            disabled={!canSend}
            accessibilityLabel="Send message"
            tone={canSend ? 'accent' : 'surface'}
            size={38}
          >
            <ArrowUp size={19} color={canSend ? colors.onAccent : colors.faint} strokeWidth={2.25} />
          </IconButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingTop: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.background,
  },
  column: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
  },
  reply: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 9,
    paddingLeft: 14,
    paddingRight: 8,
    borderRadius: 16,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    backgroundColor: colors.surface,
  },
  replyBody: {
    flex: 1,
    marginRight: 8,
  },
  replyLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.accent,
  },
  replyText: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
  },
  attachDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.surface,
    backgroundColor: colors.accent,
  },
  input: {
    flex: 1,
    minHeight: 38,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
});
