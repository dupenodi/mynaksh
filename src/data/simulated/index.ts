import type { PersonaId } from '../../domain/personas';
import type { SimulatedChat } from './build';
import { dhuniBabaChat } from './dhuniBaba';
import { kantaraChat } from './kantara';
import { sanjuBabaChat } from './sanjuBaba';

export type { SimulatedChat } from './build';

/** One complete, hand-written session per persona, each showing a different set of experiences. */
const chats: Record<PersonaId, () => SimulatedChat> = {
  'dhuni-baba': dhuniBabaChat,
  kantara: kantaraChat,
  'sanju-baba': sanjuBabaChat,
};

// Built on first use, so the timestamps are relative to when the app opened.
const cache = new Map<PersonaId, SimulatedChat>();

export function simulatedChat(personaId: PersonaId): SimulatedChat {
  if (!cache.has(personaId)) {
    cache.set(personaId, chats[personaId]());
  }
  return cache.get(personaId)!;
}
