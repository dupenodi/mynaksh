import { useRef } from 'react';
import type { View } from 'react-native';

import type { Message } from '../../domain/message';
import type { MessageAnchor } from './MessageMenu';

/** Measures the pressed view so the context menu can pin itself to it. */
export function useMenuAnchor(message: Message, onLongPress: (message: Message, anchor: MessageAnchor) => void) {
  const ref = useRef<View>(null);
  const open = () =>
    ref.current?.measureInWindow((x, y, width, height) => onLongPress(message, { x, y, width, height }));
  return { ref, open };
}
