// Safe readers for JSON the model writes. Every field is checked before use.

type Json = Record<string, unknown> | undefined;

export function text(extra: Json, key: string): string | undefined {
  const value = extra?.[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function count(extra: Json, key: string): number | undefined {
  const value = Number(extra?.[key]);
  return Number.isFinite(value) && value > 0 ? Math.round(value) : undefined;
}

export function textList(extra: Json, key: string, max = 6): string[] {
  const value = extra?.[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && !!item.trim()).slice(0, max) : [];
}

/** A list of objects, each read by `read`; entries it rejects are dropped. */
export function objectList<T>(extra: Json, key: string, read: (item: Record<string, unknown>) => T | undefined, max = 6): T[] {
  const value = extra?.[key];
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map(read)
    .filter((item): item is T => item !== undefined)
    .slice(0, max);
}

export function record(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined;
}
