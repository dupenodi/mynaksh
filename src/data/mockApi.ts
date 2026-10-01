import type { Message } from '../domain/message';
import { mockConversation, olderPages } from './mockConversation';
import { isOnline, OfflineError } from './network';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function request<T>(ms: number, run: () => T): Promise<T> {
  await wait(ms);
  if (!isOnline()) {
    throw new OfflineError();
  }
  return run();
}

export function fetchConversation(): Promise<Message[]> {
  return request(900, () => mockConversation);
}

export function fetchOlder(page: number): Promise<{ messages: Message[]; hasMore: boolean }> {
  return request(800, () => ({
    messages: olderPages[page] ?? [],
    hasMore: page + 1 < olderPages.length,
  }));
}
