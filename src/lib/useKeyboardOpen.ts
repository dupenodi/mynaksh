import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

import { DOCKED_KEYBOARD_MIN_HEIGHT } from '../components/layout';

/**
 * A docked keyboard covers the home-indicator / gesture-bar inset, so the composer
 * drops that inset while typing. Floating keyboards fire the same events but cover
 * nothing, hence the height check.
 */
export function useKeyboardOpen() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const show = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', (event) =>
      setOpen(event.endCoordinates.height > DOCKED_KEYBOARD_MIN_HEIGHT),
    );
    const hide = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', () => setOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return open;
}
