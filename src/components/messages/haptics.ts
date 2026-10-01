import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** A light tick for gestures crossing a threshold. Silent on web, where there is no motor. */
export function tapHaptic() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
}

/** The firmer bump that confirms a long press opened something. */
export function pressHaptic() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }
}
