import type { Mode } from '../data/replies';
import type { Message } from '../domain/message';
import type { PersonaId } from '../domain/personas';
import { useConversationStore } from './conversationStore';
import { sessionKey } from './session';

/** The latest message in this persona's conversation for one mode, whether it is open or parked. */
export function useLastMessage(personaId: PersonaId, mode: Mode): Message | undefined {
  return useConversationStore((state) => {
    const isOpen = state.personaId === personaId && state.mode === mode;
    const messages = isOpen ? state.messages : (state.parked[sessionKey(personaId, mode)]?.messages ?? []);
    for (let index = messages.length - 1; index >= 0; index--) {
      const message = messages[index];
      if (message.type !== 'system' && message.text) {
        return message;
      }
    }
    return undefined;
  });
}
