// Pure helpers for the birth details form: turning wheel choices into a date and back.

const pad = (value: number) => String(value).padStart(2, '0');

/** True when the chosen day, month and year form a date after today. */
export function isFuture(day: number | null, month: number | null, year: number | null): boolean {
  if (!day || !month || !year) {
    return false;
  }
  return new Date(year, month - 1, day) > new Date();
}

/** YYYY-MM-DD for a real date that is not in the future; null while anything is missing. */
export function toIso(day: number | null, month: number | null, year: number | null): string | null {
  if (!day || !month || !year) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  const real = date.getDate() === day && date.getMonth() === month - 1;
  return real && !isFuture(day, month, year) ? `${year}-${pad(month)}-${pad(day)}` : null;
}

/** Wheel values for a saved YYYY-MM-DD, so the form opens prefilled. */
export function fromIso(iso: string | undefined): { day: number | null; month: number | null; year: number | null } {
  const [year, month, day] = (iso ?? '').split('-').map(Number);
  return { day: day || null, month: month || null, year: year || null };
}

/** Wheel values for a saved HH:MM. */
export function fromClock(clock: string | undefined): { hour: number | null; minute: number | null } {
  const [hour, minute] = (clock ?? '').split(':').map(Number);
  return clock ? { hour: Number.isFinite(hour) ? hour : null, minute: Number.isFinite(minute) ? minute : null } : { hour: null, minute: null };
}

export function toClock(hour: number, minute: number): string {
  return `${pad(hour)}:${pad(minute)}`;
}
