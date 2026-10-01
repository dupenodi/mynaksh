import type { ReactNode } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { colors, floatShadow } from '../theme/colors';
import { PHONE_HEIGHT, PHONE_WIDTH, WEB_PHONE_BREAKPOINT } from './layout';

/**
 * Web only. A phone-sized viewport fills the display. A wider window gets a
 * centered iPhone frame. Native callers should not mount this.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();

  if (Platform.OS !== 'web' || width <= WEB_PHONE_BREAKPOINT) {
    return <View style={styles.fill}>{children}</View>;
  }

  return (
    <View style={styles.stage}>
      <View style={styles.phone}>
        <View style={styles.fill}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  stage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.surfaceRaised,
  },
  phone: {
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    maxWidth: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
    backgroundColor: colors.background,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    boxShadow: floatShadow,
  },
});
