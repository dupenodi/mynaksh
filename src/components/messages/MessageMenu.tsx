import { Copy, Reply, RotateCw, Trash2, type LucideIcon } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, { Easing, FadeIn, Keyframe } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Message } from '../../domain/message';
import { colors, floatShadow } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export type MessageAction = 'reply' | 'copy' | 'retry' | 'delete';

/** Where the pressed message sits on screen, in window coordinates. */
export type MessageAnchor = { x: number; y: number; width: number; height: number };

export type MenuTarget = { message: Message; anchor: MessageAnchor };

type Item = { action: MessageAction; label: string; Icon: LucideIcon; danger?: boolean };

const MENU_WIDTH = 208;
const ITEM_HEIGHT = 44;
const GAP = 8;
const EDGE = 12;

/** Reply (also a swipe), Copy and Delete; Retry only for a message that failed to send. */
export function menuItems(message: Message): Item[] {
  const items: Item[] = [
    { action: 'reply', label: 'Reply', Icon: Reply },
    { action: 'copy', label: 'Copy', Icon: Copy },
  ];
  if (message.type === 'user' && message.status === 'failed') {
    items.push({ action: 'retry', label: 'Retry', Icon: RotateCw });
  }
  items.push({ action: 'delete', label: 'Delete', Icon: Trash2, danger: true });
  return items;
}

type Props = {
  target: MenuTarget | null;
  onClose: () => void;
  onAction: (action: MessageAction, message: Message) => void;
};

/** A small popover pinned to the pressed message, on the same side the message sits. */
export function MessageMenu({ target, onClose, onAction }: Props) {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();

  if (!target) {
    return null;
  }

  const { message, anchor } = target;
  const items = menuItems(message);
  const height = items.length * ITEM_HEIGHT + 8;
  const top = placeVertically(anchor, height, insets.top + EDGE, window.height - insets.bottom - EDGE);
  const below = top >= anchor.y + anchor.height;
  const mine = message.type === 'user';
  const left = mine
    ? Math.min(anchor.x + anchor.width - MENU_WIDTH, window.width - MENU_WIDTH - EDGE)
    : Math.max(anchor.x, EDGE);

  // Grow out of the corner nearest the message, the way native context menus do.
  const entering = new Keyframe({
    0: { opacity: 0, transform: [{ translateY: below ? -6 : 6 }, { scale: 0.94 }] },
    100: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }], easing: Easing.out(Easing.cubic) },
  }).duration(160);

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close menu">
        <Animated.View entering={FadeIn.duration(160)} style={[StyleSheet.absoluteFill, styles.scrim]} />
      </Pressable>

      <Animated.View
        entering={entering}
        style={[styles.menu, { top, left: Math.max(left, EDGE), width: MENU_WIDTH }]}
        accessibilityRole="menu"
      >
        {items.map(({ action, label, Icon, danger }, index) => (
          <Pressable
            key={action}
            onPress={() => onAction(action, message)}
            accessibilityRole="menuitem"
            style={({ pressed }) => [styles.item, index > 0 && styles.divider, pressed && styles.itemPressed]}
          >
            <Text style={[styles.label, danger && styles.danger]}>{label}</Text>
            <Icon size={18} color={danger ? colors.danger : colors.text} strokeWidth={1.75} />
          </Pressable>
        ))}
      </Animated.View>
    </Modal>
  );
}

/**
 * Below the message if it fits, above if that fits, otherwise over the message. Always kept
 * on screen, since a long message can be partly scrolled out of view when pressed.
 */
function placeVertically(anchor: MessageAnchor, height: number, minTop: number, maxBottom: number) {
  const clamp = (top: number) => Math.min(Math.max(top, minTop), maxBottom - height);
  const below = anchor.y + anchor.height + GAP;
  if (below >= minTop && below + height <= maxBottom) {
    return below;
  }
  const above = anchor.y - GAP - height;
  if (above >= minTop && above + height <= maxBottom) {
    return above;
  }
  return clamp(anchor.y + Math.min(anchor.height, 200) / 2 - height / 2);
}

const styles = StyleSheet.create({
  scrim: {
    backgroundColor: colors.line,
  },
  menu: {
    position: 'absolute',
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.line,
    boxShadow: floatShadow,
  },
  item: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 10,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  itemPressed: {
    backgroundColor: colors.surface,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
  danger: {
    color: colors.danger,
  },
});
