import type { Experience, ExperienceGroupId, ExperienceSpec } from '../types';

/** Stamps each spec in a group file with its type and group, keeping the type keys literal. */
export function defineGroup<T extends Record<string, ExperienceSpec>>(
  group: ExperienceGroupId,
  specs: T,
): { [K in keyof T]: Experience } {
  const entries = Object.entries(specs).map(([type, spec]) => [type, { ...spec, type, group }]);
  return Object.fromEntries(entries) as { [K in keyof T]: Experience };
}
