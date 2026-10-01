import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { DateControl, TimeControl } from './birthControl';

type Props = {
  date: string;
  time: string;
  timeUnknown: boolean;
  onDate: (value: string) => void;
  onTime: (value: string) => void;
};

/** Date and time as two ordinary fields. The time field dims when it is unknown. */
export function BirthWhen({ date, time, timeUnknown, onDate, onTime }: Props) {
  const [dateOn, setDateOn] = useState(false);
  const [timeOn, setTimeOn] = useState(false);
  const opacity = useRef(new Animated.Value(timeUnknown ? 0.4 : 1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: timeUnknown ? 0.4 : 1,
      duration: 160,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    if (timeUnknown) {
      setTimeOn(false);
    }
  }, [opacity, timeUnknown]);

  return (
    <View style={styles.row}>
      <View style={styles.col}>
        <Text style={styles.label}>Date of birth</Text>
        <View style={[styles.box, dateOn && styles.boxOn]} {...webField}>
          <DateControl
            value={date}
            onChange={onDate}
            onFocus={() => setDateOn(true)}
            onBlur={() => setDateOn(false)}
            accessibilityLabel="Date of birth"
          />
        </View>
      </View>

      <Animated.View style={[styles.col, { opacity }]} pointerEvents={timeUnknown ? 'none' : 'auto'}>
        <Text style={styles.label}>Time of birth</Text>
        <View style={[styles.box, timeOn && !timeUnknown && styles.boxOn]} {...webField}>
          <TimeControl
            value={time}
            onChange={onTime}
            disabled={timeUnknown}
            onFocus={() => setTimeOn(true)}
            onBlur={() => setTimeOn(false)}
            accessibilityLabel="Time of birth"
          />
          {timeUnknown ? (
            <View pointerEvents="none" style={styles.unknown}>
              <Text style={styles.unknownText}>Unknown</Text>
            </View>
          ) : null}
        </View>
      </Animated.View>
    </View>
  );
}

const webField = Platform.OS === 'web' ? { dataSet: { birthField: 'true' } } : null;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  col: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    marginBottom: 7,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  box: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  boxOn: {
    borderColor: colors.brandLine,
  },
  unknown: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  unknownText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.faint,
  },
});
