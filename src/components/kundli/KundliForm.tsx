import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Toggle } from '../Toggle';
import { sunSign, type Kundli } from '../../domain/kundli';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { fromClock, fromIso, isFuture, toClock, toIso } from './birthInput';
import { DateWheels, TimeWheels, UnknownTime, daysInMonth } from './BirthWheels';
import { KundliChart } from './KundliChart';

const CITIES = ['Bengaluru', 'Mumbai', 'New Delhi', 'Hyderabad', 'Chennai', 'Kolkata'];

type Props = {
  initial: Kundli | null;
  submitLabel: string;
  onSubmit: (kundli: Kundli) => void;
  header?: ReactNode;
};

/** Birth details form. Used in the bottom sheet and inline in the chat. */
export function KundliForm({ initial, submitLabel, onSubmit, header }: Props) {
  const savedDate = fromIso(initial?.dateOfBirth);
  const savedTime = fromClock(initial?.timeOfBirth);
  const [name, setName] = useState(initial?.name ?? '');
  const [day, setDay] = useState(savedDate.day);
  const [month, setMonth] = useState(savedDate.month);
  const [year, setYear] = useState(savedDate.year);
  const [hour, setHour] = useState(savedTime.hour);
  const [minute, setMinute] = useState(savedTime.minute);
  const [timeUnknown, setTimeUnknown] = useState(initial ? !initial.timeOfBirth : false);
  const [place, setPlace] = useState(initial?.placeOfBirth ?? '');

  // Switching to a shorter month (31 Jan → Feb) pulls the day back to the month's last day.
  const maxDay = daysInMonth(month, year);
  useEffect(() => {
    if (day !== null && day > maxDay) {
      setDay(maxDay);
    }
  }, [day, maxDay]);

  const dateOfBirth = toIso(day, month, year);
  const timeValid = timeUnknown || (hour !== null && minute !== null);
  const valid = name.trim().length > 1 && dateOfBirth !== null && timeValid && place.trim().length > 1;
  const sign = dateOfBirth ? sunSign(dateOfBirth) : null;

  const submit = () => {
    if (valid && dateOfBirth) {
      onSubmit({
        name: name.trim(),
        dateOfBirth,
        timeOfBirth: timeUnknown || hour === null || minute === null ? undefined : toClock(hour, minute),
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
            {sign
              ? `Sun in ${sign.name} (${sign.english})`
              : isFuture(day, month, year)
                ? 'That date hasn’t happened yet'
                : 'Your chart takes shape as you choose'}
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

      <Field label="Date of birth">
        <DateWheels
          day={day !== null && day > maxDay ? maxDay : day}
          month={month}
          year={year}
          onDay={setDay}
          onMonth={setMonth}
          onYear={setYear}
        />
      </Field>

      <Field label="Time of birth">
        {timeUnknown ? (
          <UnknownTime />
        ) : (
          <TimeWheels hour={hour} minute={minute} onHour={setHour} onMinute={setMinute} />
        )}
      </Field>

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
  grow: {
    flex: 1,
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
    outlineStyle: 'solid',
    outlineWidth: 0,
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
