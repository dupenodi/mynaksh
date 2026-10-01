import type { Message } from '../domain/message';

/** Consecutive messages from the same sender within this window share one avatar. */
const GROUP_WINDOW_MS = 5 * 60_000;

export type TimelineItem =
  | { kind: 'day'; id: string; label: string }
  | {
      kind: 'message';
      id: string;
      message: Message;
      /** First in a run: shows avatar and name. */
      startsGroup: boolean;
      /** Last in a run: shows the timestamp and feedback chips. */
      endsGroup: boolean;
    };

function sameGroup(a: Message | undefined, b: Message | undefined): boolean {
  return (
    a !== undefined &&
    b !== undefined &&
    a.type === b.type &&
    a.type !== 'system' &&
    isSameDay(a.createdAt, b.createdAt) &&
    Math.abs(b.createdAt - a.createdAt) <= GROUP_WINDOW_MS
  );
}

function isSameDay(a: number, b: number): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export function dayLabel(time: number, now = Date.now()): string {
  if (isSameDay(time, now)) {
    return 'Today';
  }
  if (isSameDay(time, now - 24 * 60 * 60_000)) {
    return 'Yesterday';
  }
  return new Date(time).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}

export function timeLabel(time: number): string {
  return new Date(time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/**
 * Turns the flat message list into what the list renders: a day separator
 * before each new day, and group flags on every message. Pure, so it is
 * easy to test and cheap to recompute with useMemo.
 */
export function buildTimeline(messages: Message[]): TimelineItem[] {
  const items: TimelineItem[] = [];

  messages.forEach((message, index) => {
    const previous = messages[index - 1];
    const next = messages[index + 1];

    if (!previous || !isSameDay(previous.createdAt, message.createdAt)) {
      items.push({ kind: 'day', id: `day-${message.id}`, label: dayLabel(message.createdAt) });
    }

    items.push({
      kind: 'message',
      id: message.id,
      message,
      startsGroup: !sameGroup(previous, message),
      endsGroup: !sameGroup(message, next),
    });
  });

  return items;
}
