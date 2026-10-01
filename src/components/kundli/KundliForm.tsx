import { useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View, type TextStyle } from 'react-native';

import { HScroll } from '../HScroll';
import { Toggle } from '../Toggle';
import { sunSign, type Kundli, type Rashi } from '../../domain/kundli';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { BirthWhen } from './BirthWhen';
import { dateProblem, validDate, validTime } from './birthInput';
import { KundliChart } from './KundliChart';

const CITIES = ['Bengaluru', 'Mumbai', 'New Delhi', 'Hyderabad', 'Chennai', 'Kolkata'];

const webOutline: TextStyle | null =
  Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as unknown as TextStyle) : null;

type Props = {
  initial: Kundli | null;
  submitLabel: string;
  onSubmit: (kundli: Kundli) => void;
  header?: ReactNode;
};

function useKundliDraft(initial: Kundli | null) {
  const [name, setName] = useState(initial?.name ?? '');
  const [date, setDate] = useState(initial?.dateOfBirth ?? '');
  const [time, setTime] = useState(initial?.timeOfBirth ?? '');
  const [timeUnknown, setTimeUnknown] = useState(initial ? !initial.timeOfBirth : false);
  const [place, setPlace] = useState(initial?.placeOfBirth ?? '');

  const dateOfBirth = validDate(date);
  const timeOfBirth = validTime(time);
  const valid =
    name.trim().length > 1 && dateOfBirth !== null && (timeUnknown || timeOfBirth !== null) && place.trim().length > 1;
  const sign = dateOfBirth ? sunSign(dateOfBirth) : null;

  return {
    name,
    setName,
    date,
    setDate,
    time,
    setTime,
    timeUnknown,
    setTimeUnknown,
    place,
    setPlace,
    dateOfBirth,
    timeOfBirth,
    valid,
    sign,
  };
}

function signLine(sign: Rashi | null, date: string): string {
  if (sign) {
    return `Sun in ${sign.name} (${sign.english})`;
  }
  const problem = dateProblem(date);
  if (problem === 'future') {
    return 'That date hasn’t happened yet';
  }
  if (problem === 'invalid') {
    return 'That date doesn’t exist';
  }
  return 'Your chart takes shape as you choose';
}

/** Birth details form. Used in the bottom sheet and inline in the chat. */
export function KundliForm({ initial, submitLabel, onSubmit, header }: Props) {
  const {
    name,
    setName,
    date,
    setDate,
    time,
    setTime,
    timeUnknown,
    setTimeUnknown,
    place,
    setPlace,
    dateOfBirth,
    timeOfBirth,
    valid,
    sign,
  } = useKundliDraft(initial);

  const submit = () => {
    if (valid && dateOfBirth) {
      onSubmit({
        name: name.trim(),
        dateOfBirth,
        timeOfBirth: timeUnknown || !timeOfBirth ? undefined : timeOfBirth,
        placeOfBirth: place.trim(),
      });
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.headerText}>
          {header}
          <Text style={[styles.signLine, !sign && styles.signPending]}>{signLine(sign, date)}</Text>
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
          style={[styles.input, webOutline]}
          autoCapitalize="words"
        />
      </Field>

      <BirthWhen date={date} time={time} timeUnknown={timeUnknown} onDate={setDate} onTime={setTime} />

      <View style={styles.toggle}>
        <Text style={styles.toggleText}>I don’t know my birth time</Text>
        <Toggle value={timeUnknown} onValueChange={setTimeUnknown} accessibilityLabel="I don't know my birth time" />
      </View>

      <Field label="Place of birth">
        <TextInput
          value={place}
          onChangeText={setPlace}
          placeholder="City, state"
          placeholderTextColor={colors.faint}
          style={[styles.input, webOutline]}
          autoCapitalize="words"
        />
      </Field>
      <CityShortcuts place={place} onSelect={setPlace} />

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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function CityShortcuts({ place, onSelect }: { place: string; onSelect: (city: string) => void }) {
  return (
    <HScroll contentContainerStyle={styles.cities}>
      {CITIES.map((city) => (
        <HScroll.Item
          key={city}
          onPress={() => onSelect(city)}
          accessibilityLabel={city}
          style={[styles.city, place === city && styles.citySelected]}
        >
          <Text style={[styles.cityText, place === city && styles.cityTextSelected]}>{city}</Text>
        </HScroll.Item>
      ))}
    </HScroll>
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
    marginTop: 6,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  signPending: {
    fontFamily: fonts.body,
    color: colors.faint,
  },
  preview: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  field: {
    marginTop: 16,
  },
  label: {
    marginBottom: 7,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  input: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.background,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
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
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  citySelected: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  cityText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  cityTextSelected: {
    color: colors.onAccent,
  },
  submit: {
    marginTop: 20,
    minHeight: 44,
    borderRadius: 10,
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
    fontFamily: fonts.medium,
    fontSize: 14,
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
