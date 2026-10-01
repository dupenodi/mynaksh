import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { PAGE_MAX_WIDTH, SAFE_TOP_EXTRA } from './layout';

type Props = {
  children: ReactNode;
  /** Chat uses the wider column; list and profile use PAGE_MAX_WIDTH. */
  maxWidth?: number;
  bordered?: boolean;
  paddingHorizontal?: number;
};

/** Safe-area top bar. Screens only pass the inner content. */
export function ScreenHeader({
  children,
  maxWidth = PAGE_MAX_WIDTH,
  bordered = false,
  paddingHorizontal = 16,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        bordered && styles.bordered,
        { paddingTop: insets.top + SAFE_TOP_EXTRA, paddingHorizontal },
      ]}
    >
      <View style={[styles.inner, { maxWidth }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingBottom: 10,
    backgroundColor: colors.background,
  },
  bordered: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  inner: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
