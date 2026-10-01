export type Kundli = {
  name: string;
  /** YYYY-MM-DD */
  dateOfBirth: string;
  /** HH:MM, 24h. Undefined when the user does not know it. */
  timeOfBirth?: string;
  placeOfBirth: string;
};

export type Rashi = { name: string; english: string; number: number };

export const RASHIS: Rashi[] = [
  { number: 1, name: 'Mesha', english: 'Aries' },
  { number: 2, name: 'Vrishabha', english: 'Taurus' },
  { number: 3, name: 'Mithuna', english: 'Gemini' },
  { number: 4, name: 'Karka', english: 'Cancer' },
  { number: 5, name: 'Simha', english: 'Leo' },
  { number: 6, name: 'Kanya', english: 'Virgo' },
  { number: 7, name: 'Tula', english: 'Libra' },
  { number: 8, name: 'Vrischika', english: 'Scorpio' },
  { number: 9, name: 'Dhanu', english: 'Sagittarius' },
  { number: 10, name: 'Makara', english: 'Capricorn' },
  { number: 11, name: 'Kumbha', english: 'Aquarius' },
  { number: 12, name: 'Meena', english: 'Pisces' },
];

// Approximate days the Sun enters each sidereal sign: [month, day] for Mesha … Meena.
const SUN_INGRESS: [number, number][] = [
  [4, 14], [5, 15], [6, 15], [7, 16], [8, 17], [9, 17],
  [10, 17], [11, 16], [12, 16], [1, 14], [2, 13], [3, 14],
];

/**
 * Vedic (sidereal) Sun sign from the date alone. Good to a day or so, which is
 * plenty for a UI preview. The full chart is the astrologer's job.
 */
export function sunSign(dateOfBirth: string): Rashi | null {
  const [, month, day] = dateOfBirth.split('-').map(Number);
  if (!month || !day) {
    return null;
  }
  const value = month * 100 + day;
  let index = 11; // Meena, unless a later ingress has passed
  SUN_INGRESS.forEach(([m, d], i) => {
    const start = m * 100 + d;
    const next = SUN_INGRESS[(i + 1) % 12];
    const end = next[0] * 100 + next[1];
    const inRange = start < end ? value >= start && value < end : value >= start || value < end;
    if (inRange) {
      index = i;
    }
  });
  return RASHIS[index];
}

export function formatBirthDate(dateOfBirth: string): string {
  const [year, month, day] = dateOfBirth.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function describeKundli(kundli: Kundli): string {
  const sign = sunSign(kundli.dateOfBirth);
  return [
    `Name: ${kundli.name}`,
    `Date of birth: ${kundli.dateOfBirth}`,
    `Time of birth: ${kundli.timeOfBirth ?? 'unknown'}`,
    `Place of birth: ${kundli.placeOfBirth}`,
    sign ? `Sidereal Sun sign: ${sign.name} (${sign.english})` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

export function firstName(kundli: Kundli): string {
  return kundli.name.split(' ')[0];
}
