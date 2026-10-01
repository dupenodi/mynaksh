import { fetch } from 'expo/fetch';

import { humanAstrologer } from '../../domain/advisors';
import { describeKundli, type Kundli } from '../../domain/kundli';
import type { Message } from '../../domain/message';
import type { Persona } from '../../domain/personas';
import { KNOWN_RECOMMENDATION_TYPES } from '../../domain/recommendation';
import { isOnline, OfflineError } from '../network';
import { UI_MARKER, type ReplySource } from './protocol';

// In development the proxy runs on its own port. A production web build calls /api/chat on the same site.
const API_URL = process.env.EXPO_PUBLIC_API_URL || (__DEV__ ? 'http://localhost:8787' : '');

type ChatTurn = { role: 'system' | 'user' | 'assistant'; content: string };

// Each persona brings its own voice. The rules below keep all of them sounding like real people.
function systemPrompt(persona: Persona, kundli: Kundli | null): string {
  return `${persona.voice}

You are an astrologer inside the MyNaksh app.

How to talk:
- Like a real person texting. Usually 1 to 3 short sentences. No lists, no headings, no markdown.
- Sound like a person first and a character second. Use your catchphrases sparingly, never several in a row.
- If someone is hurting, comfort them first. Ask for details only after that.
- Ask one question at a time. Use the person's first name once you know it.
- Never copy the example lines word for word. They only show the tone.
- Astrology shows tendencies. Never promise medical, legal or money outcomes.

${kundli ? `Their birth details:\n${describeKundli(kundli)}` : 'You do not have their birth details yet.'}

You can show UI under your message. Most messages need none. When one helps, end your message with a new line, then ${UI_MARKER} and a JSON object using any of these keys:
- "form": "kundli" shows a birth details form. Use it when you need their birth details for a personal reading and don't have them. Also ask in words.
- "cards": up to 4 items of {"type","title","subtitle"} when there is a natural next step. Types: ${KNOWN_RECOMMENDATION_TYPES.join(', ')}. Titles under 32 characters.
- "replies": 2 or 3 short things the person might tap to answer you, under 30 characters, written in your voice.`;
}

function toChatTurns(persona: Persona, messages: Message[], kundli: Kundli | null): ChatTurn[] {
  const turns: ChatTurn[] = [{ role: 'system', content: systemPrompt(persona, kundli) }];

  for (const message of messages.slice(-20)) {
    if (message.type === 'user' && message.status !== 'failed') {
      const quote = message.replyTo ? `(replying to "${message.replyTo.text}") ` : '';
      const chart = message.attachment ? `\n${describeKundli(message.attachment.kundli)}` : '';
      turns.push({ role: 'user', content: quote + message.text + chart });
    } else if (message.type === 'ai' && message.text) {
      turns.push({ role: 'assistant', content: message.text });
    } else if (message.type === 'human') {
      turns.push({ role: 'assistant', content: `(${humanAstrologer.name}, human astrologer) ${message.text}` });
    }
  }
  return turns;
}

/**
 * Streams the reply as server-sent events. expo/fetch gives a readable body
 * stream on iOS, Android and web, so tokens can be shown as they arrive.
 */
export const liveReply: ReplySource = async ({ persona, messages, kundli, signal, onOpen, onText }) => {
  if (!isOnline()) {
    throw new OfflineError();
  }

  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: toChatTurns(persona, messages, kundli) }),
    signal,
  });
  if (!response.ok || !response.body) {
    throw new Error(`Chat request failed (${response.status})`);
  }
  onOpen();

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let raw = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ') || line === 'data: [DONE]') {
        continue;
      }
      try {
        const token = JSON.parse(line.slice(6)).choices?.[0]?.delta?.content;
        if (token) {
          raw += token;
          onText(raw);
        }
      } catch {
        continue;
      }
    }
  }

  if (!raw.trim()) {
    throw new Error('Empty reply');
  }
  return raw;
};
