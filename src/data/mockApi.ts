import type { Message } from '../domain/message';
import type { PersonaId } from '../domain/personas';
import { briefConversation, olderPages } from './mockConversation';
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

/** The brief's payload followed by the persona's simulated session, as if fetched from a server. */
export function fetchConversation(personaId: PersonaId): Promise<SimulatedChat> {
  return request(700, () => {
    const chat = simulatedChat(personaId);
    return { ...chat, messages: [...briefConversation, ...chat.messages] };
  });
}

export function fetchOlder(page: number): Promise<{ messages: Message[]; hasMore: boolean }> {
  return request(800, () => ({
    messages: olderPages[page] ?? [],
    hasMore: page + 1 < olderPages.length,
  }));
}
