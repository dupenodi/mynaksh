import { CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond';
import { Geist_400Regular, Geist_500Medium, Geist_600SemiBold } from '@expo-google-fonts/geist';

/** Loaded once in App.tsx. Each weight is its own family, so styles never set fontWeight. */
export const fontAssets = {
  CormorantGaramond_600SemiBold,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
};

/**
 * Cormorant Garamond for headings, names and figures; Geist for everything functional,
 * including chat text. Cormorant has a small x-height, so keep it at 20px and up.
 */
export const fonts = {
  display: 'CormorantGaramond_600SemiBold',
  body: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semibold: 'Geist_600SemiBold',
} as const;

/** Large Geist text needs negative tracking to look set rather than typed. */
export const tracking = (fontSize: number) => (fontSize >= 24 ? -0.035 * fontSize : fontSize >= 17 ? -0.2 : 0);

/** Cormorant is already tightly fitted; only nudge it at large sizes. */
export const displayTracking = (fontSize: number) => (fontSize >= 28 ? -0.01 * fontSize : 0);
