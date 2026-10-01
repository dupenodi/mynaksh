import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewStyle,
} from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

const ROW = 36;
const WINDOW = ROW * 3;
const YEAR_MIN = 1920;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const webScroll = Platform.select({
  web: {
    scrollSnapType: 'y mandatory',
    overscrollBehavior: 'contain',
  } as ViewStyle,
  default: undefined,
});

type Item = { value: string; label: string };

type WheelProps = {
  items: Item[];
  value: string | null;
  onChange: (value: string | null) => void;
  accessibilityLabel: string;
  flex?: number;
};

function Wheel({ items, value, onChange, accessibilityLabel, flex = 1 }: WheelProps) {
  const scroller = useRef<ScrollView>(null);
  const itemsRef = useRef(items);
  const onChangeRef = useRef(onChange);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  itemsRef.current = items;
  onChangeRef.current = onChange;

  const index = Math.max(
    0,
    items.findIndex((item) => item.value === (value ?? '')),
  );
  const [offset, setOffset] = useState(index * ROW);

  useLayoutEffect(() => {
    scroller.current?.scrollTo({ y: index * ROW, animated: false });
    setOffset(index * ROW);
  }, [index, items.length]);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const settle = (y: number) => {
    const list = itemsRef.current;
    const nextIndex = Math.max(0, Math.min(list.length - 1, Math.round(y / ROW)));
    const target = nextIndex * ROW;
    if (Math.abs(y - target) > 1) {
      scroller.current?.scrollTo({ y: target, animated: true });
    }
    const next = list[nextIndex]?.value ?? '';
    onChangeRef.current(next === '' ? null : next);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    setOffset(y);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => settle(y), 80);
  };

  const choose = (itemIndex: number) => {
    const next = items[itemIndex];
    if (!next) {
      return;
    }
    scroller.current?.scrollTo({ y: itemIndex * ROW, animated: true });
    onChange(next.value === '' ? null : next.value);
  };

  const current = items[index];

  return (
    <ScrollView
      ref={scroller}
      style={[styles.wheel, { flex }, webScroll]}
      showsVerticalScrollIndicator={false}
      snapToInterval={ROW}
      decelerationRate="fast"
      scrollEventThrottle={16}
      nestedScrollEnabled
      contentOffset={{ x: 0, y: index * ROW }}
      onScroll={onScroll}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: current && current.value !== '' ? current.label : 'not set' }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        const delta = event.nativeEvent.actionName === 'increment' ? 1 : -1;
        choose(Math.max(0, Math.min(items.length - 1, index + delta)));
      }}
    >
      <View style={styles.spacer} />
      {items.map((item, itemIndex) => {
        const distance = Math.abs(itemIndex - offset / ROW);
        const active = distance < 0.45;
        return (
          <Pressable key={item.value || 'blank'} onPress={() => choose(itemIndex)} style={styles.row}>
            <Text
              style={[
                styles.figure,
                active ? styles.figureActive : styles.figureQuiet,
                { opacity: Math.max(0.28, 1 - distance * 0.5), transform: [{ scale: active ? 1 : 0.94 }] },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
      <View style={styles.spacer} />
    </ScrollView>
  );
}

function Plate({ children }: { children: ReactNode }) {
  return (
    <View style={styles.plate}>
      <View pointerEvents="none" style={styles.band} />
      {children}
    </View>
  );
}

function numericChange(onChange: (value: number | null) => void) {
  return (value: string | null) => onChange(value === null ? null : Number(value));
}

function withBlank(blank: string, rest: Item[]): Item[] {
  return [{ value: '', label: blank }, ...rest];
}

export function daysInMonth(month: number | null, year: number | null): number {
  if (!month) {
    return 31;
  }
  return new Date(year ?? 2000, month, 0).getDate();
}

type DateProps = {
  day: number | null;
  month: number | null;
  year: number | null;
  onDay: (value: number | null) => void;
  onMonth: (value: number | null) => void;
  onYear: (value: number | null) => void;
};

/** Three wheels for a birth date. The center row is the choice; scroll or tap a row. */
export function DateWheels({ day, month, year, onDay, onMonth, onYear }: DateProps) {
  const thisYear = new Date().getFullYear();
  const maxDay = daysInMonth(month, year);

  const days = useMemo(
    () => withBlank('Day', Array.from({ length: maxDay }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))),
    [maxDay],
  );
  const months = useMemo(
    () => withBlank('Month', MONTHS.map((label, i) => ({ value: String(i + 1), label }))),
    [],
  );
  const years = useMemo(
    () =>
      withBlank(
        'Year',
        Array.from({ length: thisYear - YEAR_MIN + 1 }, (_, i) => {
          const value = String(thisYear - i);
          return { value, label: value };
        }),
      ),
    [thisYear],
  );
  const decades = useMemo(() => {
    const start = Math.floor(thisYear / 10) * 10;
    const list: number[] = [];
    for (let decade = start; decade >= YEAR_MIN; decade -= 10) {
      list.push(decade);
    }
    return list;
  }, [thisYear]);

  return (
    <View>
      <Plate>
        <Wheel items={days} value={day === null ? null : String(day)} onChange={numericChange(onDay)} accessibilityLabel="Day of birth" flex={0.7} />
        <Wheel items={months} value={month === null ? null : String(month)} onChange={numericChange(onMonth)} accessibilityLabel="Month of birth" flex={1.3} />
        <Wheel items={years} value={year === null ? null : String(year)} onChange={numericChange(onYear)} accessibilityLabel="Year of birth" flex={0.9} />
      </Plate>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.decades}>
        {decades.map((decade) => {
          const selected = year !== null && Math.floor(year / 10) * 10 === decade;
          return (
            <Pressable
              key={decade}
              onPress={() => onYear(Math.min(decade, thisYear))}
              accessibilityRole="button"
              accessibilityLabel={`${decade}s`}
              style={styles.decade}
            >
              <Text style={[styles.decadeText, selected && styles.decadeOn]}>{decade}s</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

type TimeProps = {
  hour: number | null;
  minute: number | null;
  onHour: (value: number | null) => void;
  onMinute: (value: number | null) => void;
};

/** Hour and minute wheels, 24-hour. */
export function TimeWheels({ hour, minute, onHour, onMinute }: TimeProps) {
  const hours = useMemo(
    () =>
      withBlank(
        'Hr',
        Array.from({ length: 24 }, (_, i) => {
          const label = String(i).padStart(2, '0');
          return { value: String(i), label };
        }),
      ),
    [],
  );
  const minutes = useMemo(
    () =>
      withBlank(
        'Min',
        Array.from({ length: 60 }, (_, i) => {
          const label = String(i).padStart(2, '0');
          return { value: String(i), label };
        }),
      ),
    [],
  );

  return (
    <Plate>
      <Wheel items={hours} value={hour === null ? null : String(hour)} onChange={numericChange(onHour)} accessibilityLabel="Hour of birth" />
      <Text pointerEvents="none" style={styles.colon}>
        :
      </Text>
      <Wheel items={minutes} value={minute === null ? null : String(minute)} onChange={numericChange(onMinute)} accessibilityLabel="Minute of birth" />
    </Plate>
  );
}

export function UnknownTime() {
  return (
    <View style={[styles.plate, styles.unknownPlate]}>
      <Text style={styles.unknown}>Unknown</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    height: WINDOW,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  band: {
    position: 'absolute',
    left: 6,
    right: 6,
    top: ROW,
    height: ROW,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.brandLine,
  },
  wheel: {
    height: WINDOW,
  },
  spacer: {
    height: ROW,
  },
  row: {
    height: ROW,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ scrollSnapAlign: 'start' } as ViewStyle) : null),
  },
  figure: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 26,
  },
  figureActive: {
    color: colors.text,
  },
  figureQuiet: {
    color: colors.faint,
  },
  colon: {
    position: 'absolute',
    left: '50%',
    top: ROW,
    width: 16,
    marginLeft: -8,
    height: ROW,
    lineHeight: ROW,
    textAlign: 'center',
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.text,
    zIndex: 1,
  },
  decades: {
    gap: 2,
    paddingTop: 8,
  },
  decade: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  decadeText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.faint,
  },
  decadeOn: {
    color: colors.brand,
  },
  unknownPlate: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unknown: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 28,
    color: colors.faint,
  },
});
