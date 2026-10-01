import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../theme/colors';

type Props = {
  source: ImageSourcePropType;
  /** Width over height. Below 1 makes a tall arch. */
  aspectRatio?: number;
  /** Colour the portrait fades into at the bottom. */
  fadeTo?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

// A radius far larger than the frame is clamped to half its width, giving a true semicircular top.
const ARCH = 9999;

/**
 * A portrait framed like a temple doorway: semicircular top, an inner brass outline,
 * and a fade at the foot so text can sit on the image.
 */
export function ArchPortrait({ source, aspectRatio = 0.86, fadeTo = colors.surface, style, children }: Props) {
  return (
    <View style={[styles.frame, { aspectRatio }, style]}>
      <Image source={source} style={styles.image} resizeMode="cover" accessibilityIgnoresInvertColors />
      <LinearGradient
        colors={['transparent', 'transparent', fadeTo]}
        locations={[0, 0.45, 1]}
        style={styles.overlay}
      />
      <View style={styles.inset} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  // Explicit size: on web an Image without a width takes the file's own width.
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  frame: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderTopLeftRadius: ARCH,
    borderTopRightRadius: ARCH,
    backgroundColor: colors.surfaceRaised,
  },
  inset: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 10,
    left: 10,
    right: 10,
    bottom: -1,
    borderTopLeftRadius: ARCH,
    borderTopRightRadius: ARCH,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(214, 172, 94, 0.45)',
  },
});
