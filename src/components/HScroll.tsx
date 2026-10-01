import { useEffect, useRef, type ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

type HScrollProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

type ItemProps = {
  onPress: () => void;
  children: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
};

type WebScroller = {
  scrollLeft: number;
  scrollWidth: number;
  clientWidth: number;
  addEventListener: (type: 'wheel', fn: (event: WebWheel) => void, opts?: { passive?: boolean }) => void;
  removeEventListener: (type: 'wheel', fn: (event: WebWheel) => void) => void;
};

type WebWheel = {
  deltaX: number;
  deltaY: number;
  preventDefault: () => void;
};

/** Horizontal row. Up and down stays with the list. Sideways moves the row. */
function HScrollRoot({ children, style, contentContainerStyle }: HScrollProps) {
  const ref = useRef<ScrollView>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }
    const el = ref.current as unknown as WebScroller | null;
    if (!el?.addEventListener) {
      return;
    }
    // The chat list consumes every wheel, including a sideways one, and then
    // drops it. Apply only sideways movement here. Up and down is left alone.
    const onWheel = (event: WebWheel) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
        return;
      }
      if (el.scrollWidth <= el.clientWidth) {
        return;
      }
      event.preventDefault();
      el.scrollLeft += event.deltaX;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <ScrollView
      ref={ref}
      horizontal
      nestedScrollEnabled
      directionalLockEnabled
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      style={[styles.scroller, style]}
      contentContainerStyle={[styles.row, contentContainerStyle]}
      {...(Platform.OS === 'web' ? { dataSet: { hscroll: 'true' } } : null)}
    >
      {children}
    </ScrollView>
  );
}

function HScrollItem({ onPress, children, accessibilityLabel, style, pressedStyle }: ItemProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [style, pressed && pressedStyle]}
    >
      {children}
    </Pressable>
  );
}

export const HScroll = Object.assign(HScrollRoot, { Item: HScrollItem });

const styles = StyleSheet.create({
  // flexGrow 0 overrides RN-web's default, which stretches the row to its contents and then nothing scrolls.
  scroller: {
    flexGrow: 0,
    width: '100%',
    minWidth: 0,
  },
  row: {
    flexGrow: 0,
    alignSelf: 'flex-start',
  },
});
