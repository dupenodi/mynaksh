/**
 * MyNaksh's own palette (mynaksh.com): warm off-white page, oat surfaces, ink text,
 * and one rust accent ("mud") for actions and anything that needs to be found.
 */
export const colors = {
  background: '#FBFAF8',
  surface: '#F5F0E9',
  surfaceRaised: '#EDE5DA',
  line: 'rgba(22, 26, 36, 0.08)',
  lineStrong: 'rgba(22, 26, 36, 0.14)',
  text: '#161A24',
  muted: '#4A3E2C',
  faint: '#8C7A60',
  /** Brand mud. Primary actions, active states, the logo. */
  brand: '#803003',
  brandPressed: '#6B2802',
  brandSoft: '#FBF3EC',
  brandLine: 'rgba(128, 48, 3, 0.24)',
  accent: '#803003',
  accentSoft: 'rgba(128, 48, 3, 0.1)',
  onAccent: '#FBFAF8',
  /** The user's own bubbles. */
  paper: '#EDE5DA',
  paperPressed: '#E2D7C6',
  ink: '#161A24',
  inkMuted: '#4A3E2C',
  /** Positive feedback, e.g. a liked reply. MyNaksh's "ok" green. */
  positive: '#5A7A3C',
  positiveSoft: 'rgba(90, 122, 60, 0.12)',
  human: '#5A7A3C',
  humanTint: '#F2F5EC',
  humanPressed: '#E7EEDD',
  humanLine: 'rgba(90, 122, 60, 0.16)',
  humanLineStrong: 'rgba(90, 122, 60, 0.25)',
  humanRing: 'rgba(90, 122, 60, 0.35)',
  online: '#3F9B5B',
  danger: '#A83224',
  dangerTint: '#FBEDEA',
  dangerLine: 'rgba(200, 64, 47, 0.3)',
  /** Text on a brand button that should read quieter, e.g. a caption. */
  onAccentMuted: 'rgba(251, 250, 248, 0.7)',
  /** Near-opaque white for bars and labels that sit over content. */
  frosted: 'rgba(255, 255, 255, 0.94)',
  scrim: 'rgba(22, 26, 36, 0.32)',
} as const;

/** Raised controls: a hairline drawn inside plus a 1.5px drop, so buttons read as pressable. */
export const raisedShadow = '0 1.5px 0 rgba(22, 26, 36, 0.06), inset 0 0 0 1px rgba(22, 26, 36, 0.12)';

/** Floating surfaces (menus, toasts, the composer): a soft warm lift. */
export const floatShadow = '0 1px 2px rgba(74, 62, 44, 0.06), 0 12px 32px rgba(74, 62, 44, 0.12)';

/** Cards resting in the page (inline forms, the composer). */
export const cardShadow = '0 1px 2px rgba(74, 62, 44, 0.04), 0 8px 24px rgba(74, 62, 44, 0.05)';

/** Bottom sheets: the shadow falls upwards. */
export const sheetShadow = '0 -8px 40px rgba(74, 62, 44, 0.12)';

/** Small floating controls such as toasts and the jump-to-latest button. */
export const liftShadow = '0 4px 16px rgba(74, 62, 44, 0.1)';
