import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { colors, liftShadow } from '../theme/colors';
import { fonts } from '../theme/typography';

const VISIBLE_MS = 2200;

type ToastProps = {
  message: string | null;
  onHide: () => void;
};

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
    bottom: 150,
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
