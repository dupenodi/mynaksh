import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Toggle } from '../Toggle';

import type { Mode } from '../../state/conversationStore';
import { colors } from '../../theme/colors';
import { fonts, displayTracking } from '../../theme/typography';
import { Sheet } from '../Sheet';

type Props = {
  visible: boolean;
  mode: Mode;
  isOnline: boolean;
  onClose: () => void;
  onToggleOnline: (online: boolean) => void;
  onReload: () => void;
  onClear: () => void;
};

function sessionCaption(mode: Mode): string {
  return mode === 'demo'
    ? 'Demo mode plays a scripted conversation. No API key needed.'
    : 'Live mode sends your messages to the model through the chat proxy.';
}

export function SettingsSheet({ visible, mode, isOnline, onClose, onToggleOnline, onReload, onClear }: Props) {
  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>Session</Text>
      <Text style={styles.caption}>{sessionCaption(mode)}</Text>

      <View style={styles.group}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Simulate offline</Text>
            <Text style={styles.hint}>Sends fail, so you can retry.</Text>
          </View>
          <Toggle
            value={!isOnline}
            onValueChange={(offline) => onToggleOnline(!offline)}
            accessibilityLabel="Simulate offline"
          />
        </View>

        {mode === 'demo' ? (
          <Row
            label="Reload conversation"
            hint="Shows the loading state. Turn on offline first to see the error state."
            onPress={onReload}
          />
        ) : null}
        <Row
          label={mode === 'demo' ? 'Start an empty conversation' : 'New conversation'}
          hint="Clears this chat and shows the empty state."
          onPress={onClear}
        />
      </View>
    </Sheet>
  );
}

function Row({ label, hint, onPress }: { label: string; hint: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, styles.divider, pressed && styles.pressed]}
    >
      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
      <ChevronRight size={18} color={colors.faint} strokeWidth={1.75} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: displayTracking(28),
    color: colors.text,
  },
  caption: {
    marginTop: 6,
    marginBottom: 18,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
  group: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  pressed: {
    backgroundColor: colors.surface,
  },
  rowText: {
    flex: 1,
    paddingRight: 12,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  hint: {
    marginTop: 3,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
});
