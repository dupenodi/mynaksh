import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, sheetShadow } from '../theme/colors';
import { CONTENT_MAX_WIDTH } from './layout';

type SheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

function SheetPanel({ onClose, children }: Omit<SheetProps, 'visible'>) {
  const insets = useSafeAreaInsets();

  return (
    // Padding on Android too: under edge-to-edge the window no longer resizes for the keyboard.
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
      />
      <Animated.View
        entering={SlideInDown.springify().damping(20).stiffness(180)}
        style={[styles.panel, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}
      >
        <Animated.View style={styles.handle} />
        {children}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

/** Bottom sheet: Modal on native; in-tree overlay on web so it stays inside the phone frame. */
export function Sheet({ visible, onClose, children }: SheetProps) {
  if (Platform.OS === 'web') {
    if (!visible) {
      return null;
    }
    return (
      <View style={styles.webHost}>
        <SheetPanel onClose={onClose}>{children}</SheetPanel>
      </View>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <SheetPanel onClose={onClose}>{children}</SheetPanel>
    </Modal>
  );
}

const styles = StyleSheet.create({
  webHost: {
    ...StyleSheet.absoluteFill,
    zIndex: 40,
  },
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.scrim,
  },
  panel: {
    width: '100%',
    maxHeight: '92%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.background,
    boxShadow: sheetShadow,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 18,
    backgroundColor: colors.lineStrong,
  },
});
