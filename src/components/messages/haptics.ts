import { trigger } from 'react-native-haptic-feedback';

const options = { enableVibrateFallback: false, ignoreAndroidSystemSettings: false };

/** A light tick for gestures crossing a threshold. */
export function tapHaptic() {
  trigger('impactLight', options);
}

/** The firmer bump that confirms a long press opened something. */
export function pressHaptic() {
  trigger('impactMedium', options);
}
