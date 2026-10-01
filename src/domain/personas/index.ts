import { dhuniBaba } from './dhuniBaba';
import { kantara } from './kantara';
import { sanjuBaba } from './sanjuBaba';
import type { Persona, PersonaId } from './types';

export type { DemoLines, Persona, PersonaId, Review } from './types';

/**
 * One file per persona. To add one: create its file, add its id to PersonaId,
 * and list it here. The list, profile, chat and both reply sources pick it up.
 */
export const personas: Record<PersonaId, Persona> = {
  'dhuni-baba': dhuniBaba,
  kantara,
  'sanju-baba': sanjuBaba,
};

/** In the order the home screen lists them. */
export const personaList: Persona[] = Object.values(personas);

/** Unknown ids (e.g. a stale shared link) fall back to the first persona. */
export function getPersona(id: string): Persona {
  return personas[id as PersonaId] ?? personaList[0];
}
