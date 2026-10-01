import { fetch } from 'expo/fetch';

import { isOnline, OfflineError } from '../network';
import { toChatTurns, toHumanTurns } from './prompt';
import type { ReplySource } from './protocol';
import { readTextStream } from './sse';

// In development the proxy runs on its own port. A production web build calls /api/chat on the same site.
const API_URL = process.env.EXPO_PUBLIC_API_URL || (__DEV__ ? 'http://localhost:8787' : '');

/**
 * Streams the reply from the chat proxy. expo/fetch gives a readable body
 * stream on iOS, Android and web, so tokens can be shown as they arrive.
 */
export const liveReply: ReplySource = async ({ speaker, persona, messages, kundli, signal, onOpen, onText }) => {
  if (!isOnline()) {
    throw new OfflineError();
  }

  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages:
        speaker.kind === 'human'
          ? toHumanTurns(persona, messages, kundli, speaker.booking)
          : toChatTurns(persona, messages, kundli),
    }),
    signal,
  });
  if (!response.ok || !response.body) {
    throw new Error(`Chat request failed (${response.status})`);
  }
  onOpen();

  const raw = await readTextStream(response.body, onText);
  if (!raw.trim()) {
    throw new Error('Empty reply');
  }
  return raw;
};
