import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, raisedShadow } from '../theme/colors';
import { fonts } from '../theme/typography';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'regular' | 'large';
  disabled?: boolean;
  /** Small text after the label, such as a price. */
  caption?: string;
  icon?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'regular',
  disabled = false,
  caption,
  icon,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const primary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        size === 'large' && styles.large,
        styles[variant],
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.row}>
        {icon}
        <Text
          style={[
            styles.label,
            size === 'large' && styles.largeLabel,
            primary ? styles.primaryLabel : styles.quietLabel,
            disabled && styles.disabledLabel,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {caption ? <Text style={[styles.caption, primary && styles.primaryCaption]}>{caption}</Text> : null}
      </View>
    </Pressable>
  );
}

type IconButtonProps = {
  onPress: () => void;
  accessibilityLabel: string;
  children: ReactNode;
  size?: number;
  tone?: 'surface' | 'clear' | 'accent';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  onPress,
  accessibilityLabel,
  children,
  size = 36,
  tone = 'surface',
  disabled = false,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.icon,
        { width: size, height: size, borderRadius: size / 2 },
        tone === 'surface' && styles.secondary,
        tone === 'accent' && styles.primary,
        pressed && styles.pressed,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 40,
    paddingHorizontal: 18,
    // Pills, as on mynaksh.com.
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: {
    minHeight: 48,
    paddingHorizontal: 22,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.background,
    boxShadow: raisedShadow,
  },
  ghost: {},
  disabled: {
    backgroundColor: colors.surfaceRaised,
    boxShadow: 'none',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  largeLabel: {
    fontSize: 15,
  },
  primaryLabel: {
    color: colors.onAccent,
  },
  quietLabel: {
    color: colors.text,
  },
  disabledLabel: {
    color: colors.faint,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
  primaryCaption: {
    color: colors.onAccentMuted,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
