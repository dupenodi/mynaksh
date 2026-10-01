import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { sunSign, type Kundli } from '../../domain/kundli';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { KundliChart } from './KundliChart';

const CITIES = ['Bengaluru', 'Mumbai', 'New Delhi', 'Hyderabad', 'Chennai', 'Kolkata'];

type Props = {
  initial: Kundli | null;
  submitLabel: string;
  onSubmit: (kundli: Kundli) => void;
  header?: ReactNode;
};

// Typing "21081996" shows "21 / 08 / 1996".
function maskDate(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join(' / ');
}

function maskTime(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
}

// Returns YYYY-MM-DD only for a real date that is not in the future.
function parseDate(masked: string): string | null {
  const [dd, mm, yyyy] = masked.split(' / ').map(Number);
  if (!dd || !mm || !yyyy || yyyy < 1900) {
    return null;
  }
  const date = new Date(yyyy, mm - 1, dd);
  const valid = date.getDate() === dd && date.getMonth() === mm - 1 && date <= new Date();
  return valid ? `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}` : null;
}

function toMasked(iso: string): string {
  const [yyyy, mm, dd] = iso.split('-');
  return `${dd} / ${mm} / ${yyyy}`;
}

/** Birth details form. Used in the bottom sheet and inline in the chat. */
export function KundliForm({ initial, submitLabel, onSubmit, header }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [date, setDate] = useState(initial ? toMasked(initial.dateOfBirth) : '');
  const [time, setTime] = useState(initial?.timeOfBirth ?? '');
  const [timeUnknown, setTimeUnknown] = useState(initial ? !initial.timeOfBirth : false);
  const [place, setPlace] = useState(initial?.placeOfBirth ?? '');

  const dateOfBirth = parseDate(date);
  const timeValid = timeUnknown || /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
  const valid = name.trim().length > 1 && dateOfBirth !== null && timeValid && place.trim().length > 1;
  const sign = dateOfBirth ? sunSign(dateOfBirth) : null;

  const submit = () => {
    if (valid && dateOfBirth) {
      onSubmit({
        name: name.trim(),
        dateOfBirth,
        timeOfBirth: timeUnknown ? undefined : time,
        placeOfBirth: place.trim(),
      });
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.headerText}>
          {header}
          <Text style={[styles.signLine, !sign && styles.signPending]}>
            {sign ? `Sun in ${sign.name} (${sign.english})` : 'Your chart takes shape as you type'}
          </Text>
        </View>
        <View style={styles.preview}>
          <KundliChart size={72} firstSign={sign?.number ?? null} firstHousePlanets={sign ? ['Su'] : []} />
        </View>
      </View>

      <Field label="Full name">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="As on your birth certificate"
          placeholderTextColor={colors.faint}
          style={styles.input}
          autoCapitalize="words"
        />
      </Field>

      <View style={styles.row}>
        <Field label="Date of birth" grow>
          <TextInput
            value={date}
            onChangeText={(text) => setDate(maskDate(text))}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={colors.faint}
            style={styles.input}
            keyboardType="number-pad"
          />
        </Field>
        <Field label="Time of birth" grow>
          <TextInput
            value={timeUnknown ? '' : time}
            onChangeText={(text) => setTime(maskTime(text))}
            placeholder={timeUnknown ? 'Unknown' : 'HH:MM'}
            placeholderTextColor={colors.faint}
            style={[styles.input, timeUnknown && styles.inputDisabled]}
            keyboardType="number-pad"
            editable={!timeUnknown}
          />
        </Field>
      </View>

      <View style={styles.toggle}>
        <Text style={styles.toggleText}>I don’t know my birth time</Text>
        <Switch
          value={timeUnknown}
          onValueChange={setTimeUnknown}
          trackColor={{ true: colors.accent, false: colors.lineStrong }}
          thumbColor={colors.text}
          accessibilityLabel="I don't know my birth time"
        />
      </View>

      <Field label="Place of birth">
        <TextInput
          value={place}
          onChangeText={setPlace}
          placeholder="City, state"
          placeholderTextColor={colors.faint}
          style={styles.input}
          autoCapitalize="words"
        />
      </Field>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cities}>
        {CITIES.map((city) => (
          <Pressable
            key={city}
            onPress={() => setPlace(city)}
            accessibilityRole="button"
            style={[styles.city, place === city && styles.citySelected]}
          >
            <Text style={[styles.cityText, place === city && styles.cityTextSelected]}>{city}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        onPress={submit}
        disabled={!valid}
        accessibilityRole="button"
        accessibilityState={{ disabled: !valid }}
        style={({ pressed }) => [styles.submit, !valid && styles.submitDisabled, pressed && styles.pressed]}
      >
        <Text style={[styles.submitText, !valid && styles.submitTextDisabled]}>{submitLabel}</Text>
      </Pressable>
      <Text style={styles.privacy}>Used only for this conversation.</Text>
    </View>
  );
}

function Field({ label, children, grow }: { label: string; children: ReactNode; grow?: boolean }) {
  return (
    <View style={[styles.field, grow && styles.grow]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerText: {
    flex: 1,
  },
  signLine: {
    marginTop: 8,
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.accent,
  },
  signPending: {
    fontFamily: fonts.body,
    color: colors.faint,
  },
  preview: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.line,
  },
  field: {
    marginTop: 16,
  },
  grow: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    marginBottom: 7,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.background,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text,
    outlineWidth: 0,
  },
  inputDisabled: {
    opacity: 0.45,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  toggleText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
  },
  cities: {
    gap: 8,
    paddingTop: 10,
  },
  city: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
  },
  citySelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  cityText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  cityTextSelected: {
    color: colors.accent,
  },
  submit: {
    marginTop: 22,
    minHeight: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  submitDisabled: {
    backgroundColor: colors.surfaceRaised,
  },
  pressed: {
    opacity: 0.86,
  },
  submitText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.onAccent,
  },
  submitTextDisabled: {
    color: colors.faint,
  },
  privacy: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.faint,
  },
});
