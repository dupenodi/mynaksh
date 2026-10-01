import type { Message } from '../domain/message';
import type { PersonaId } from '../domain/personas';
import { olderPages } from './mockConversation';
import { isOnline, OfflineError } from './network';
import { simulatedChat, type SimulatedChat } from './simulated';
import { wait } from './wait';

async function request<T>(ms: number, run: () => T): Promise<T> {
  await wait(ms);
  if (!isOnline()) {
    throw new OfflineError();
  }
  return run();
}

/** The persona's simulated session, as if fetched from a server. */
export function fetchConversation(personaId: PersonaId): Promise<SimulatedChat> {
  return request(700, () => simulatedChat(personaId));
}

export function fetchOlder(page: number): Promise<{ messages: Message[]; hasMore: boolean }> {
  return request(800, () => ({
    messages: olderPages[page] ?? [],
    hasMore: page + 1 < olderPages.length,
  }));
}
