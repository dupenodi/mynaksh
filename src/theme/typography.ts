/**
 * Cormorant Garamond for headings, names and figures; Geist for everything functional,
 * including chat text. Bundled from assets/fonts; each name is the file's PostScript name, which
 * both iOS and Android resolve, so styles never set fontWeight. Cormorant has a small x-height, so keep it at 20px and up.
 */
export const fonts = {
  display: 'CormorantGaramond-SemiBold',
  body: 'Geist-Regular',
  medium: 'Geist-Medium',
  semibold: 'Geist-SemiBold',
} as const;

/** Large Geist text needs negative tracking to look set rather than typed. */
export const tracking = (fontSize: number) => (fontSize >= 24 ? -0.035 * fontSize : fontSize >= 17 ? -0.2 : 0);

/** Cormorant is already tightly fitted; only nudge it at large sizes. */
export const displayTracking = (fontSize: number) => (fontSize >= 28 ? -0.01 * fontSize : 0);
