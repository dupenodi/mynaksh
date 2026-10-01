import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '../../theme/colors';
import { PRESSED_OPACITY } from '../layout';

type Props = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  badge?: boolean;
};

export function BadgeIconButton({ icon: Icon, label, onPress, badge }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
    >
      <Icon size={21} color={colors.text} strokeWidth={1.75} />
      {badge ? <View style={styles.iconBadge} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.background,
    backgroundColor: colors.brand,
  },
  pressed: {
    opacity: PRESSED_OPACITY,
  },
});
