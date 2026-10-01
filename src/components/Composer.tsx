import { ArrowUp, Plus, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
  type TextStyle,
} from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ReplyRef } from '../domain/message';
import { useKeyboardOpen } from '../lib/useKeyboardOpen';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { IconButton } from './Button';
import { COMPOSER_KEYBOARD_PAD, CONTENT_MAX_WIDTH } from './layout';

type ComposerProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
  replyingTo: ReplyRef | null;
  onCancelReply: () => void;
  onAttachPress: () => void;
  hasKundli: boolean;
  placeholder: string;
};

const LINE_HEIGHT = 22;
const BUTTON = 40;
const MIN_INPUT = LINE_HEIGHT;
const MAX_INPUT = LINE_HEIGHT * 6;

const clampHeight = (height: number) => Math.min(MAX_INPUT, Math.max(MIN_INPUT, height));

// RN's outlineStyle type omits "none". The browser focus ring is the blue box.
const webInput: TextStyle | null =
  Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as unknown as TextStyle) : null;

/** One row: attach, a text field that grows up to six lines, send. */
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
  const keyboardOpen = useKeyboardOpen();

  // Choosing "Reply" focuses the input so the user can type straight away.
  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus();
    }
  }, [replyingTo]);

  // In a browser, Enter sends and Shift+Enter adds a line. On phones, Return adds a line.
  const onKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData> & { shiftKey?: boolean }) => {
    if (Platform.OS === 'web' && event.nativeEvent.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  const send = () => {
    if (!canSend) {
      return;
    }
    onSend(draft.trim());
    setDraft('');
    setInputHeight(MIN_INPUT);
  };

  return (
    <View
      style={[styles.bar, { paddingBottom: keyboardOpen ? COMPOSER_KEYBOARD_PAD : Math.max(insets.bottom, COMPOSER_KEYBOARD_PAD) }]}
    >
      <View style={styles.column}>
        {replyingTo ? <ReplyPreview reply={replyingTo} onCancel={onCancelReply} /> : null}

        <View style={styles.row}>
          <View>
            <IconButton
              onPress={onAttachPress}
              accessibilityLabel={hasKundli ? 'Edit your birth details' : 'Share your birth details'}
              size={BUTTON}
            >
              <Plus size={18} color={colors.text} strokeWidth={1.75} />
            </IconButton>
            {hasKundli ? <View style={styles.attachDot} /> : null}
          </View>

          <View style={styles.field}>
            <TextInput
              ref={inputRef}
              value={draft}
              onChangeText={setDraft}
              onKeyPress={onKeyPress}
              onContentSizeChange={(event) => setInputHeight(clampHeight(event.nativeEvent.contentSize.height))}
              multiline
              placeholder={placeholder}
              placeholderTextColor={colors.faint}
              style={[styles.input, webInput, { height: inputHeight }]}
              scrollEnabled={inputHeight >= MAX_INPUT}
              accessibilityLabel="Message"
            />
          </View>

          <IconButton
            onPress={send}
            disabled={!canSend}
            accessibilityLabel="Send message"
            tone={canSend ? 'accent' : 'surface'}
            size={BUTTON}
          >
            <ArrowUp size={18} color={canSend ? colors.onAccent : colors.faint} strokeWidth={2.25} />
          </IconButton>
        </View>
      </View>
    </View>
  );
}

function ReplyPreview({ reply, onCancel }: { reply: ReplyRef; onCancel: () => void }) {
  return (
    <Animated.View entering={FadeInDown.duration(200)} exiting={FadeOutDown.duration(150)} style={styles.reply}>
      <View style={styles.replyBody}>
        <Text style={styles.replyLabel}>Replying to {reply.author}</Text>
        <Text style={styles.replyText} numberOfLines={1}>
          {reply.text}
        </Text>
      </View>
      <IconButton onPress={onCancel} accessibilityLabel="Cancel reply" size={28}>
        <X size={14} color={colors.muted} strokeWidth={2} />
      </IconButton>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingTop: 6,
    paddingHorizontal: 12,
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  field: {
    flex: 1,
    minHeight: BUTTON,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.background,
  },
  input: {
    padding: 0,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: LINE_HEIGHT,
    color: colors.text,
    textAlignVertical: 'top',
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
});
