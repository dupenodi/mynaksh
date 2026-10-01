import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { ArrowDown } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn, ZoomOut } from 'react-native-reanimated';

import type { Kundli } from '../domain/kundli';
import type { Message } from '../domain/message';
import type { Persona } from '../domain/personas';
import type { Mode } from '../state/conversationStore';
import { buildTimeline, type TimelineItem } from '../state/timeline';
import { colors, liftShadow } from '../theme/colors';
import { fonts } from '../theme/typography';
import { CONTENT_MAX_WIDTH, JUMP_SCROLL_THRESHOLD, SCREEN_GUTTER } from './layout';
import { DaySeparator, MessageRow } from './messages/MessageRow';
import type { MessageActions } from './messages/types';
import { TypingIndicator } from './messages/TypingIndicator';

export type ConversationListHandle = {
  scrollToLatest: () => void;
};

type Props = {
  mode: Mode;
  messages: Message[];
  persona: Persona;
  kundli: Kundli | null;
  savedKundli: Kundli | null;
  isTyping: boolean;
  hasOlder: boolean;
  isLoadingOlder: boolean;
  selectedId: string | undefined;
  openedAt: number;
  messageActions: MessageActions;
  onLoadOlder: () => void;
};

export const ConversationList = forwardRef<ConversationListHandle, Props>(function ConversationList(
  {
    mode,
    messages,
    persona,
    kundli,
    savedKundli,
    isTyping,
    hasOlder,
    isLoadingOlder,
    selectedId,
    openedAt,
    messageActions,
    onLoadOlder,
  },
  ref,
) {
  const listRef = useRef<FlatList<TimelineItem>>(null);
  const [showJump, setShowJump] = useState(false);

  // The list is inverted (newest at index 0), so the timeline is reversed.
  const items = useMemo(() => buildTimeline(messages).reverse(), [messages]);

  const scrollToLatest = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  useImperativeHandle(ref, () => ({ scrollToLatest }), [scrollToLatest]);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<TimelineItem>) => {
      if (item.kind === 'day') {
        return <DaySeparator label={item.label} />;
      }
      const isNew = item.message.createdAt >= openedAt;
      return (
        <Animated.View entering={isNew ? FadeInDown.duration(320) : undefined}>
          <MessageRow
            message={item.message}
            layout={{
              startsGroup: item.startsGroup,
              endsGroup: item.endsGroup,
              isLatest: index === 0,
              selected: item.message.id === selectedId,
            }}
            persona={persona}
            kundli={kundli}
            savedKundli={savedKundli}
            actions={messageActions}
          />
        </Animated.View>
      );
    },
    [openedAt, persona, kundli, savedKundli, messageActions, selectedId],
  );

  // In an inverted list, offset 0 is the newest message.
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setShowJump(event.nativeEvent.contentOffset.y > JUMP_SCROLL_THRESHOLD);
  };

  return (
    <Animated.View key={mode} entering={FadeIn.duration(300)} style={styles.listWrap}>
      <FlatList
        ref={listRef}
        inverted
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        ListHeaderComponent={isTyping ? <TypingIndicator persona={persona} /> : null}
        ListFooterComponent={
          isLoadingOlder || !hasOlder ? (
            <ConversationStart isLoadingOlder={isLoadingOlder} hasOlder={hasOlder} />
          ) : null
        }
        onEndReached={onLoadOlder}
        onEndReachedThreshold={0.25}
        onScroll={onScroll}
        scrollEventThrottle={64}
        initialNumToRender={12}
        maxToRenderPerBatch={8}
        windowSize={11}
        removeClippedSubviews={Platform.OS === 'android'}
      />

      {showJump ? (
        <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.jump}>
          <Pressable
            onPress={scrollToLatest}
            accessibilityRole="button"
            accessibilityLabel="Jump to latest message"
            style={styles.jumpButton}
          >
            <ArrowDown size={18} color={colors.text} strokeWidth={1.75} />
          </Pressable>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
});

function ConversationStart({ isLoadingOlder, hasOlder }: { isLoadingOlder: boolean; hasOlder: boolean }) {
  if (isLoadingOlder) {
    return <ActivityIndicator style={styles.olderSpinner} color={colors.muted} />;
  }
  if (!hasOlder) {
    return <Text style={styles.beginning}>This is where your conversation begins</Text>;
  }
  return null;
}

const styles = StyleSheet.create({
  listWrap: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH + SCREEN_GUTTER * 2,
    alignSelf: 'center',
    paddingHorizontal: SCREEN_GUTTER,
    // Inverted: paddingTop sits under the newest message. Its own bottom margin is gap enough.
    paddingTop: 0,
    paddingBottom: 8,
  },
  olderSpinner: {
    marginVertical: 20,
  },
  beginning: {
    marginVertical: 26,
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.faint,
  },
  jump: {
    position: 'absolute',
    right: 20,
    bottom: 12,
  },
  jumpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    boxShadow: liftShadow,
  },
});
