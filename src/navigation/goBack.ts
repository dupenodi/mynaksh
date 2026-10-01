import type { NavigationProp } from '@react-navigation/native';

import type { RootStackParamList } from './types';

/** Back if there is somewhere to go back to; home otherwise (e.g. after opening a shared link). */
export function goBackOrHome(navigation: NavigationProp<RootStackParamList>): void {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate('Astrologers');
  }
}
