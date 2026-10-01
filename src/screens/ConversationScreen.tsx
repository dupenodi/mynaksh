import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { ArrowDown } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';

import { Composer } from '../components/Composer';
import { ConversationHeader } from '../components/ConversationHeader';
import { EmptyState, LoadError, LoadingSkeleton } from '../components/ConversationStates';
import { CONTENT_MAX_WIDTH, SCREEN_GUTTER } from '../components/layout';
import { DaySeparator, MessageRow } from '../components/messages/MessageRow';
import { TypingIndicator } from '../components/messages/TypingIndicator';
import { KundliSheet } from '../components/sheets/KundliSheet';
import { MessageActionsSheet, type MessageAction } from '../components/sheets/MessageActionsSheet';
import { RecommendationSheet } from '../components/sheets/RecommendationSheet';
import { SettingsSheet } from '../components/sheets/SettingsSheet';
import { Toast } from '../components/Toast';
import { humanAstrologer } from '../domain/advisors';
import type { Kundli } from '../domain/kundli';
import type { Message, ReplyRef } from '../domain/message';
import { personaList, personas, type Persona } from '../domain/personas';
import type { Recommendation } from '../domain/recommendation';
import type { RootStackParamList } from '../navigation/types';
import { getAppearance } from '../recommendations/appearance';
import { useConversationStore, type Mode } from '../state/conversationStore';
import { buildTimeline, type TimelineItem } from '../state/timeline';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

// Store actions never change, so they are read once instead of subscribed to.
const actions = useConversationStore.getState();

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export function ConversationScreen({ route, navigation }: Props) {
  const persona = personas[route.params.personaId] ?? personaList[0];
  const { mode, messages, status, kundli, savedKundli, isOnline, isTyping, hasOlder, isLoadingOlder, replyingTo } =
    useConversationStore(
      useShallow((state) => ({
        mode: state.mode,
        messages: state.messages,
        status: state.status,
        kundli: state.kundli,
        savedKundli: state.savedKundli,
        isOnline: state.isOnline,
        isTyping: state.isTyping,
        hasOlder: state.hasOlder,
        isLoadingOlder: state.isLoadingOlder,
        replyingTo: state.replyingTo,
      })),
    );

  const listRef = useRef<FlatList<TimelineItem>>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedCard, setSelectedCard] = useState<Recommendation | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [kundliOpen, setKundliOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showJump, setShowJump] = useState(false);

  // Messages older than the screen do not animate in, so history appears calmly.
  const openedAt = useRef(Date.now()).current;

  // Each persona has its own conversation. Opening this screen switches to it.
  useEffect(() => {
    actions.openChat(persona.id);
  }, [persona.id]);

  // The list is inverted (newest at index 0), so the timeline is reversed.
  const items = useMemo(() => buildTimeline(messages).reverse(), [messages]);

  const scrollToLatest = () => listRef.current?.scrollToOffset({ offset: 0, animated: true });

  const send = useCallback((text: string) => {
    actions.sendMessage(text);
    scrollToLatest();
  }, []);

  const shareKundli = useCallback((details: Kundli) => {
    setKundliOpen(false);
    actions.attachKundli(details);
    scrollToLatest();
  }, []);

  const openKundli = useCallback(() => setKundliOpen(true), []);
  const hideToast = useCallback(() => setToast(null), []);

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
            startsGroup={item.startsGroup}
            endsGroup={item.endsGroup}
            isLatest={index === 0}
            persona={persona}
            kundli={kundli}
            savedKundli={savedKundli}
            onLongPress={setSelectedMessage}
            onRecommendationPress={setSelectedCard}
            onRate={actions.rate}
            onToggleReason={actions.toggleDislikeReason}
            onRetry={actions.retryMessage}
            onQuickReply={send}
            onSubmitKundli={shareKundli}
            onEditKundli={openKundli}
          />
        </Animated.View>
      );
    },
    [openedAt, persona, kundli, savedKundli, send, shareKundli, openKundli],
  );

  const onMessageAction = async (action: MessageAction, message: Message) => {
    setSelectedMessage(null);
    switch (action) {
      case 'reply':
        actions.setReplyingTo(toReplyRef(message, persona));
        break;
      case 'copy':
        await Clipboard.setStringAsync(message.text);
        setToast('Copied to clipboard');
        break;
      case 'retry':
        actions.retryMessage(message.id);
        break;
      case 'delete':
        actions.deleteMessage(message.id);
        setToast('Message deleted');
        break;
    }
  };

  const onConfirmCard = (recommendation: Recommendation) => {
    setSelectedCard(null);
    setToast(`${getAppearance(recommendation.type).cta}: ${recommendation.title}`);
  };

  const changeMode = (next: Mode) => {
    setShowJump(false);
    actions.setMode(next);
  };

  // In an inverted list, offset 0 is the newest message.
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setShowJump(event.nativeEvent.contentOffset.y > 320);
  };

  const listTop = isLoadingOlder ? (
    <ActivityIndicator style={styles.olderSpinner} color={colors.muted} />
  ) : !hasOlder ? (
    <Text style={styles.beginning}>This is where your conversation begins</Text>
  ) : null;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ConversationHeader
        persona={persona}
        mode={mode}
        isOnline={isOnline}
        isTyping={isTyping}
        chartOwner={kundli ? kundli.name.split(' ')[0] : null}
        onBack={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Astrologers'))}
        onProfilePress={() => navigation.navigate('Profile', { personaId: persona.id })}
        onModeChange={changeMode}
        onMenuPress={() => setSettingsOpen(true)}
      />

      {status === 'loading' ? <LoadingSkeleton /> : null}
      {status === 'error' ? <LoadError onRetry={actions.load} /> : null}
      {status === 'ready' && messages.length === 0 ? <EmptyState persona={persona} onPick={send} onShareKundli={openKundli} /> : null}
      {status === 'ready' && messages.length > 0 ? (
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
            ListFooterComponent={listTop}
            onEndReached={actions.loadOlder}
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
      ) : null}

      <Composer
        onSend={send}
        disabled={status !== 'ready'}
        replyingTo={replyingTo}
        onCancelReply={() => actions.setReplyingTo(null)}
        onAttachPress={openKundli}
        hasKundli={kundli !== null}
        placeholder={persona.placeholder}
      />
      <Toast message={toast} onHide={hideToast} />

      <MessageActionsSheet message={selectedMessage} onClose={() => setSelectedMessage(null)} onAction={onMessageAction} />
      <RecommendationSheet recommendation={selectedCard} onClose={() => setSelectedCard(null)} onConfirm={onConfirmCard} />
      <KundliSheet visible={kundliOpen} initial={kundli ?? savedKundli} onClose={() => setKundliOpen(false)} onAttach={shareKundli} />
      <SettingsSheet
        visible={settingsOpen}
        mode={mode}
        isOnline={isOnline}
        onClose={() => setSettingsOpen(false)}
        onToggleOnline={actions.setOnline}
        onReload={() => {
          setSettingsOpen(false);
          actions.load();
        }}
        onClear={() => {
          setSettingsOpen(false);
          actions.clearConversation();
        }}
      />
    </KeyboardAvoidingView>
  );
}

function toReplyRef(message: Message, persona: Persona): ReplyRef {
  const authors = { user: 'You', system: 'MyNaksh', ai: persona.name, human: humanAstrologer.name };
  return { id: message.id, author: authors[message.type], text: message.text };
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listWrap: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH + SCREEN_GUTTER * 2,
    alignSelf: 'center',
    paddingHorizontal: SCREEN_GUTTER,
    paddingTop: 12,
    paddingBottom: 8,
  },
  olderSpinner: {
    marginVertical: 20,
  },
  beginning: {
    marginVertical: 26,
    textAlign: 'center',
    fontFamily: fonts.displayItalic,
    fontSize: 17,
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
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
  },
});
