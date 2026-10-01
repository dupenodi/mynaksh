import { CalendarDays, MessageCircle, Sparkles, Sun, User, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

type Tab = { label: string; icon: LucideIcon };

const TABS: Tab[] = [
  { label: 'Chats', icon: MessageCircle },
  { label: 'Horoscope', icon: Sun },
  { label: 'Kundli', icon: Sparkles },
  { label: 'Panchang', icon: CalendarDays },
  { label: 'Profile', icon: User },
];

type Props = {
  bottomInset: number;
  /** Every tab but Chats is a placeholder for now. */
  onDummyTab: () => void;
};

export function TabBar({ bottomInset, onDummyTab }: Props) {
  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(bottomInset, 8) }]} accessibilityRole="tablist">
      {TABS.map(({ label, icon: Icon }, index) => {
        const active = index === 0;
        return (
          <Pressable
            key={label}
            onPress={active ? undefined : onDummyTab}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
          >
            <Icon size={22} color={active ? colors.brand : colors.faint} strokeWidth={active ? 2 : 1.75} />
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.background,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  pressed: {
    opacity: 0.6,
  },
  tabLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.faint,
  },
  tabLabelActive: {
    color: colors.brand,
  },
});
