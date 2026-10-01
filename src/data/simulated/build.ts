import type { Kundli } from '../../domain/kundli';
import type { Message } from '../../domain/message';
import { encodeReply, parseReply, type ReplyUiPayload } from '../replies/protocol';

const MINUTE = 60_000;

export type Step =
  | { say: 'system'; text: string }
  | { say: 'user'; text: string; kundli?: Kundli }
  | { say: 'ai'; text: string; ui?: ReplyUiPayload; liked?: boolean }
  | { say: 'human'; text: string };

export const system = (text: string): Step => ({ say: 'system', text });
export const user = (text: string, kundli?: Kundli): Step => ({ say: 'user', text, kundli });
export const ai = (text: string, ui?: ReplyUiPayload, liked?: boolean): Step => ({ say: 'ai', text, ui, liked });
export const human = (text: string): Step => ({ say: 'human', text });

export type SimulatedChat = { messages: Message[]; kundli: Kundli | null };

/**
 * Turns a short script into messages that started `startedMinutesAgo` and are
 * two minutes apart. AI turns go through the real reply format and parser, so a
 * simulated chat renders exactly like a live one.
 */
export function buildChat(id: string, steps: Step[], startedMinutesAgo = 75): SimulatedChat {
  const start = Date.now() - startedMinutesAgo * MINUTE;
  let kundli: Kundli | null = null;

  const messages = steps.map((step, index): Message => {
    const base = { id: `${id}-${index}`, text: step.text, createdAt: start + index * 2 * MINUTE };
    switch (step.say) {
      case 'system':
        return { ...base, type: 'system' };
      case 'human':
        return { ...base, type: 'human' };
      case 'user':
        kundli = step.kundli ?? kundli;
        return {
          ...base,
          type: 'user',
          status: 'sent',
          attachment: step.kundli ? { kind: 'kundli', kundli: step.kundli } : undefined,
        };
      case 'ai': {
        const parsed = parseReply(encodeReply(step.text, step.ui), base.id);
        return { ...base, type: 'ai', ...parsed, feedback: step.liked ? { rating: 'like' } : undefined };
      }
    }
  });

  return { messages, kundli };
}

/** A slot on the next half hour, about three hours from now, for the booking note. */
export function bookedSlot(): number {
  const slot = new Date(Date.now() + 3 * 60 * MINUTE);
  slot.setMinutes(slot.getMinutes() < 30 ? 30 : 60, 0, 0);
  return slot.getTime();
}
