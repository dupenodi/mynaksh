import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const mark = require('../../assets/images/mynaksh-mark.png');

/** The mynaksh.com navbar lockup: the pebble mark beside the wordmark in brand mud. */
export function BrandLogo({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.lockup, style]} accessibilityRole="header" accessibilityLabel="MyNaksh">
      <Image source={mark} style={styles.mark} resizeMode="contain" accessible={false} />
      <Text style={styles.wordmark}>MyNaksh</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mark: {
    width: 40,
    height: 40,
  },
  wordmark: {
    fontFamily: fonts.display,
    // The site sets this in Recoleta at 24px; Cormorant needs a few px more to match its weight.
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: -0.025 * 28,
    color: colors.brand,
  },
});
