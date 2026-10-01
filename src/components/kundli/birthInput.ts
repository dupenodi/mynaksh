// Date and time strings for the birth form. Inputs speak YYYY-MM-DD and HH:MM.

const EARLIEST_YEAR = 1920;

const pad = (value: number) => String(value).padStart(2, '0');

export const EARLIEST_BIRTH = `${EARLIEST_YEAR}-01-01`;

export function todayIso(now = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

type DateParts = { year: number; month: number; day: number };

function readIso(iso: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    return null;
  }
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

function isRealDate(parts: DateParts): boolean {
  const date = new Date(parts.year, parts.month - 1, parts.day);
  return date.getFullYear() === parts.year && date.getMonth() === parts.month - 1 && date.getDate() === parts.day;
}

export type DateProblem = 'empty' | 'invalid' | 'future';

/** Why a date string cannot be a birth date. Null means it can. */
export function dateProblem(iso: string): DateProblem | null {
  if (!iso) {
    return 'empty';
  }
  const parts = readIso(iso);
  if (!parts || !isRealDate(parts) || parts.year < EARLIEST_YEAR) {
    return 'invalid';
  }
  return iso > todayIso() ? 'future' : null;
}

/** YYYY-MM-DD for a real birth date, or null. */
export function validDate(iso: string): string | null {
  return dateProblem(iso) === null ? iso : null;
}

/** HH:MM for a real clock time. Accepts a trailing :SS from the browser time input. */
export function validTime(clock: string): string | null {
  const match = /^(\d{2}):(\d{2})/.exec(clock);
  if (!match) {
    return null;
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) {
    return null;
  }
  return `${match[1]}:${match[2]}`;
}

/** DD/MM/YYYY while typing. An ISO paste is kept as a date, not read as digits. */
export function maskDate(raw: string): string {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (iso) {
    return `${iso[3]}/${iso[2]}/${iso[1]}`;
  }
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** YYYY-MM-DD once eight digits are in, including dates the form will reject. */
export function isoFromDisplay(text: string): string {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : '';
}

export function displayDate(iso: string): string {
  const parts = readIso(iso);
  return parts ? `${pad(parts.day)}/${pad(parts.month)}/${parts.year}` : '';
}

export function maskTime(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function displayTime(clock: string): string {
  return validTime(clock) ?? '';
}
