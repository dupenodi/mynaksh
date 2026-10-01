import type { ReactNode } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '../theme/colors';

type Props = {
  source: ImageSourcePropType;
  /** Width over height of the picture. */
  aspectRatio?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  /** Drawn over the picture, such as a label pill. */
  children?: ReactNode;
};

const INSET = 5;

/** A picture set inside a hairline frame, with a few pixels of white between them. */
export function FramedImage({ source, aspectRatio = 1, radius = 16, style, children }: Props) {
  return (
    <View style={[styles.frame, { borderRadius: radius }, style]}>
      <View style={[styles.inner, { aspectRatio, borderRadius: radius - INSET }]}>
        <Image source={source} style={styles.image} resizeMode="cover" accessibilityIgnoresInvertColors />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    padding: INSET,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.background,
  },
  inner: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  // Explicit size: on web an Image without a width takes the file's own width.
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
});
