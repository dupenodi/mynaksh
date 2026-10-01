import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { colors } from '../theme/colors';

type AvatarProps = {
  source: ImageSourcePropType;
  size: number;
  ring?: string;
  online?: boolean;
};

export function Avatar({ source, size, ring = colors.lineStrong, online }: AvatarProps) {
  const inner = size - 4;
  const dot = Math.max(8, Math.round(size * 0.24));

  return (
    <View style={{ width: size, height: size }}>
      <View style={[styles.ring, { borderRadius: size / 2, borderColor: ring }]}>
        <Image
          source={source}
          style={{ width: inner, height: inner, borderRadius: inner / 2 }}
          accessibilityIgnoresInvertColors
        />
      </View>
      {online !== undefined ? (
        <View
          style={[
            styles.dot,
            {
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: online ? colors.online : colors.faint,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: colors.surfaceRaised,
  },
  dot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: colors.background,
  },
});
