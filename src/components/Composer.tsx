import { ArrowUp, Plus, X } from 'lucide-react-native';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ReplyRef } from '../domain/message';
import { cardShadow, colors } from '../theme/colors';
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

const LINE_HEIGHT = 24;
const MIN_INPUT = LINE_HEIGHT;
const MAX_INPUT = LINE_HEIGHT * 6;

const clampHeight = (height: number) => Math.min(MAX_INPUT, Math.max(MIN_INPUT, height));

type KeyEvent = NativeSyntheticEvent<TextInputKeyPressEventData> & {
  shiftKey?: boolean;
  preventDefault?: () => void;
  nativeEvent: TextInputKeyPressEventData & { isComposing?: boolean };
};

/**
 * A card rather than a pill: the text gets its own line and grows up to six lines,
 * with the actions in a row underneath.
 */
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
  const [inputHeight, setInputHeight] = useState(MIN_INPUT);
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
    setInputHeight(MIN_INPUT);
  };

  // A web textarea never reports shrinking, so measure it directly: collapse, read scrollHeight, set.
  useLayoutEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }
    const node = inputRef.current as unknown as HTMLTextAreaElement | null;
    if (!node) {
      return;
    }
    node.style.height = '0px';
    const next = clampHeight(node.scrollHeight);
    node.style.height = `${next}px`;
    setInputHeight(next);
  }, [draft]);

  // On the web, Enter sends and Shift+Enter starts a new line. On phones, Return adds a line and the button sends.
  const onKeyPress = (event: KeyEvent) => {
    if (Platform.OS !== 'web' || event.nativeEvent.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }
    event.preventDefault?.();
    send();
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
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

        <View style={styles.card}>
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            onKeyPress={onKeyPress}
            onContentSizeChange={
              Platform.OS === 'web'
                ? undefined
                : (event) => setInputHeight(clampHeight(event.nativeEvent.contentSize.height))
            }
            multiline
            placeholder={placeholder}
            placeholderTextColor={colors.faint}
            style={[styles.input, { height: inputHeight }]}
            scrollEnabled={inputHeight >= MAX_INPUT}
            accessibilityLabel="Message"
          />

          <View style={styles.tools}>
            <View>
              <IconButton
                onPress={onAttachPress}
                accessibilityLabel={hasKundli ? 'Edit your birth details' : 'Share your birth details'}
                size={34}
              >
                <Plus size={17} color={colors.text} strokeWidth={1.75} />
              </IconButton>
              {hasKundli ? <View style={styles.attachDot} /> : null}
            </View>
            <IconButton
              onPress={send}
              disabled={!canSend}
              accessibilityLabel="Send message"
              tone={canSend ? 'accent' : 'surface'}
              size={34}
            >
              <ArrowUp size={18} color={canSend ? colors.onAccent : colors.faint} strokeWidth={2.25} />
            </IconButton>
          </View>
        </View>

        <Text style={styles.disclaimer}>AI readings are for reflection, not for big decisions.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingTop: 8,
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
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.brand,
    backgroundColor: colors.surface,
  },
  replyBody: {
    flex: 1,
    marginRight: 8,
  },
  replyLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.brand,
  },
  replyText: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
  card: {
    paddingTop: 14,
    paddingHorizontal: 8,
    paddingBottom: 8,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.background,
    boxShadow: cardShadow,
  },
  input: {
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 0,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: LINE_HEIGHT,
    color: colors.text,
    textAlignVertical: 'top',
    // The page's dark color-scheme gives a bare textarea its own fill and border; clear both.
    backgroundColor: 'transparent',
    borderWidth: 0,
    // Chrome draws its own focus ring for outline-style auto, whatever the width.
    outlineStyle: 'solid',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  tools: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  attachDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.background,
    backgroundColor: colors.brand,
  },
  disclaimer: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.faint,
    textAlign: 'center',
  },
});
