import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from './types';

// Gives every screen a real URL on the web, so refresh and shared links work.
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['mynaksh://'],
  config: {
    screens: {
      Astrologers: '',
      Profile: 'astrologer/:personaId',
      Chat: 'chat/:personaId',
    },
  },
};
