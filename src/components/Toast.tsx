import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { colors, liftShadow } from '../theme/colors';
import { fonts } from '../theme/typography';
import { TOAST_ABOVE_COMPOSER } from './layout';

const VISIBLE_MS = 2200;

type ToastProps = {
  message: string | null;
  onHide: () => void;
};

/** Local toast state for screens that show a short confirmation. */
export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const hide = useCallback(() => setMessage(null), []);
  const show = useCallback((next: string) => setMessage(next), []);
  return { message, show, hide };
}

export function Toast({ message, onHide }: ToastProps) {
  useEffect(() => {
    if (!message) {
      return;
    }
    const timer = setTimeout(onHide, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [message, onHide]);

  if (!message) {
    return null;
  }

  return (
    <Animated.View
      key={message}
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
      style={styles.toast}
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    pointerEvents: 'none',
    bottom: TOAST_ABOVE_COMPOSER,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: colors.ink,
    boxShadow: liftShadow,
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.onAccent,
  },
});
