import { isOnline, OfflineError } from '../network';
import { wait } from '../wait';
import { scriptedHumanReply, scriptedReply } from './demoScript';
import { encodeReply, type ReplySource } from './protocol';

const ACCEPT_MS = 450;
const THINK_MS = 900;
const CHARS_PER_TICK = 4;
const TICK_MS = 18;

// Streams the scripted text a few characters at a time, like the live source.
export const demoReply: ReplySource = async ({ speaker, persona, messages, kundli, signal, onOpen, onText }) => {
  await wait(ACCEPT_MS, signal);
  if (!isOnline()) {
    throw new OfflineError();
  }
  onOpen();
  await wait(THINK_MS, signal);

  const { text, ui } =
    speaker.kind === 'human' ? scriptedHumanReply(persona, kundli, speaker.booking) : scriptedReply(persona, messages, kundli);
  const raw = encodeReply(text, ui);

  // Only the visible text is typed out; the UI JSON arrives in one piece at the end.
  for (let end = CHARS_PER_TICK; end < text.length; end += CHARS_PER_TICK) {
    onText(raw.slice(0, end));
    await wait(TICK_MS, signal);
  }
  onText(raw);
  return raw;
};
