import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { personaList, type PersonaId } from '../../domain/personas';
import { colors } from '../../theme/colors';
import { displayTracking, fonts } from '../../theme/typography';
import { Avatar } from '../Avatar';
import { Sheet } from '../Sheet';

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (personaId: PersonaId) => void;
};

/** Who to start a fresh live chat with. */
export function PersonaPickerSheet({ visible, onClose, onPick }: Props) {
  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>Start a live chat</Text>
      <Text style={styles.subtitle}>A fresh chat with a real model.</Text>

      {personaList.map((persona) => (
        <Pressable
          key={persona.id}
          onPress={() => onPick(persona.id)}
          accessibilityRole="button"
          accessibilityLabel={`Start a live chat with ${persona.name}`}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <Avatar source={persona.avatar} size={44} />
          <View style={styles.body}>
            <Text style={styles.name}>{persona.name}</Text>
            <Text style={styles.meta} numberOfLines={1}>
              {persona.specialties.slice(0, 3).join(' · ')}
            </Text>
          </View>
          <ChevronRight size={18} color={colors.faint} strokeWidth={1.75} />
        </Pressable>
      ))}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: displayTracking(28),
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  pressed: {
    opacity: 0.7,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
});
