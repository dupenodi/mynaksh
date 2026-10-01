import { Platform } from 'react-native';

import { isOnline, OfflineError } from '../network';
import { toChatTurns, toHumanTurns } from './prompt';
import type { ReplySource } from './protocol';
import { createSseReader } from './sse';

// In development, the proxy in server/proxy.mjs (the Android emulator reaches the host at 10.0.2.2).
// Release builds use the hosted endpoint; the web build calls its own domain.
const HOSTED_URL = 'https://mynaksh-umber.vercel.app';
const DEV_URL = Platform.select({ android: 'http://10.0.2.2:8787', default: 'http://localhost:8787' });
const API_URL = Platform.OS === 'web' ? '' : __DEV__ ? DEV_URL : HOSTED_URL;

/**
 * Streams the reply from the chat proxy. React Native's fetch has no readable body, but XHR
 * reports progress as the response grows, so tokens can be shown as they arrive.
 */
export const liveReply: ReplySource = async ({ speaker, persona, messages, kundli, signal, onOpen, onText }) => {
  if (!isOnline()) {
    throw new OfflineError();
  }

  const body = JSON.stringify({
    messages:
      speaker.kind === 'human'
        ? toHumanTurns(persona, messages, kundli, speaker.booking)
        : toChatTurns(persona, messages, kundli),
  });
  const reader = createSseReader(onText);
  await streamPost(`${API_URL}/api/chat`, body, signal, onOpen, reader.push);

  const raw = reader.text();
  if (!raw.trim()) {
    throw new Error('Empty reply');
  }
  return raw;
};

function streamPost(
  url: string,
  body: string,
  signal: AbortSignal,
  onOpen: () => void,
  onChunk: (chunk: string) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let seen = 0;
    const flush = () => {
      onChunk(xhr.responseText.slice(seen));
      seen = xhr.responseText.length;
    };

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED && xhr.status >= 200 && xhr.status < 300) {
        onOpen();
      }
    };
    xhr.onprogress = flush;
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`Chat request failed (${xhr.status})`));
        return;
      }
      flush();
      resolve();
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.onabort = () => reject(new Error('Aborted'));
    signal.addEventListener('abort', () => xhr.abort());
    xhr.send(body);
  });
}
