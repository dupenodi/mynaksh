import type { Mode } from '../data/replies';
import type { Kundli } from '../domain/kundli';
import type { Message } from '../domain/message';
import type { PersonaId } from '../domain/personas';

export type LoadStatus = 'loading' | 'ready' | 'error';

/** Everything that belongs to one conversation. Every persona has one per mode. */
export type Session = {
  messages: Message[];
  status: LoadStatus;
  kundli: Kundli | null;
  hasOlder: boolean;
  olderPage: number;
};

export type SessionKey = `${PersonaId}:${Mode}`;

export const sessionKey = (personaId: PersonaId, mode: Mode): SessionKey => `${personaId}:${mode}`;

/** Demo starts by loading the mock history; live starts empty and ready. */
export const freshSession = (mode: Mode): Session => ({
  messages: [],
  status: mode === 'demo' ? 'loading' : 'ready',
  kundli: null,
  hasOlder: mode === 'demo',
  olderPage: 0,
});

/** A parked session must not look busy, so unfinished work is settled: sending → failed, streaming → done. */
export function settle(messages: Message[]): Message[] {
  return messages.map((message) => {
    if (message.type === 'user' && message.status === 'sending') {
      return { ...message, status: 'failed' };
    }
    if (message.type === 'ai' && message.isStreaming) {
      return { ...message, isStreaming: false };
    }
    return message;
  });
}
