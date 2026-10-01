import Clipboard from '@react-native-clipboard/clipboard';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import type { ConversationListHandle } from '../components/ConversationList';
import { useToast } from '../components/Toast';
import { pressHaptic } from '../components/messages/haptics';
import type { MessageAction, MessageAnchor, MenuTarget } from '../components/messages/MessageMenu';
import type { MessageActions } from '../components/messages/types';
import { humanAstrologer } from '../domain/advisors';
import type { Kundli } from '../domain/kundli';
import { toReplyRef, type Message } from '../domain/message';
import type { Persona } from '../domain/personas';
import type { Recommendation } from '../domain/recommendation';
import type { DetailActions } from '../recommendations/details';
import { useConversationStore, type Mode } from '../state/conversationStore';

export function useConversationScreen(persona: Persona, mode: Mode) {
  const session = useConversationStore(
    useShallow((state) => ({
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

  const listRef = useRef<ConversationListHandle>(null);
  const [menu, setMenu] = useState<MenuTarget | null>(null);
  const [selectedCard, setSelectedCard] = useState<Recommendation | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [kundliOpen, setKundliOpen] = useState(false);
  const toast = useToast();

  // Messages older than the screen do not animate in, so history appears calmly.
  const openedAt = useRef(Date.now()).current;

  // Each persona has one conversation per mode. Opening this screen switches to it.
  useEffect(() => {
    useConversationStore.getState().openChat(persona.id, mode);
  }, [persona.id, mode]);

  const scrollToLatest = () => listRef.current?.scrollToLatest();

  const send = useCallback((text: string) => {
    void useConversationStore.getState().sendMessage(text);
    scrollToLatest();
  }, []);

  const shareKundli = useCallback((details: Kundli) => {
    setKundliOpen(false);
    void useConversationStore.getState().attachKundli(details);
    scrollToLatest();
  }, []);

  const openKundli = useCallback(() => setKundliOpen(true), []);

  const load = useCallback(() => {
    void useConversationStore.getState().load();
  }, []);

  const loadOlder = useCallback(() => {
    void useConversationStore.getState().loadOlder();
  }, []);

  const cancelReply = useCallback(() => {
    useConversationStore.getState().setReplyingTo(null);
  }, []);

  const onMessageAction = useCallback(
    (action: MessageAction, message: Message) => {
      setMenu(null);
      const store = useConversationStore.getState();
      switch (action) {
        case 'reply':
          store.setReplyingTo(toReplyRef(message, { ai: persona.name, human: humanAstrologer.name }));
          break;
        case 'copy':
          Clipboard.setString(message.text);
          toast.show('Copied to clipboard');
          break;
        case 'retry':
          void store.retryMessage(message.id);
          break;
        case 'delete':
          store.deleteMessage(message.id);
          toast.show('Message deleted');
          break;
      }
    },
    [persona.name, toast.show],
  );

  const openMenu = useCallback((message: Message, anchor: MessageAnchor) => {
    pressHaptic();
    setMenu({ message, anchor });
  }, []);

  const selectedId = menu?.message.id;

  const messageActions: MessageActions = useMemo(
    () => ({
      onLongPress: openMenu,
      onAction: onMessageAction,
      onRecommendationPress: setSelectedCard,
      onRate: (id, rating) => useConversationStore.getState().rate(id, rating),
      onToggleReason: (id, reason) => useConversationStore.getState().toggleDislikeReason(id, reason),
      onRetry: (id) => {
        void useConversationStore.getState().retryMessage(id);
      },
      onQuickReply: send,
      onSubmitKundli: shareKundli,
      onEditKundli: openKundli,
    }),
    [openMenu, onMessageAction, send, shareKundli, openKundli],
  );

  // What a card's detail view can do: confirm with a toast, ask the astrologer, or book a call.
  const cardActions: DetailActions = useMemo(
    () => ({
      close: () => setSelectedCard(null),
      confirm: (message) => {
        setSelectedCard(null);
        toast.show(message);
      },
      ask: (text) => {
        setSelectedCard(null);
        send(text);
      },
      book: (booking) => {
        setSelectedCard(null);
        void useConversationStore.getState().bookConsultation(booking);
        scrollToLatest();
      },
    }),
    [send, toast.show],
  );

  const reloadSession = useCallback(() => {
    setSettingsOpen(false);
    void useConversationStore.getState().load();
  }, []);

  const clearSession = useCallback(() => {
    setSettingsOpen(false);
    useConversationStore.getState().clearConversation();
  }, []);

  const setOnline = useCallback((online: boolean) => {
    useConversationStore.getState().setOnline(online);
  }, []);

  return {
    session,
    send,
    shareKundli,
    openKundli,
    kundliOpen,
    setKundliOpen,
    overlays: {
      menu,
      setMenu,
      openMenu,
      onMessageAction,
      selectedCard,
      setSelectedCard,
      cardActions,
      settingsOpen,
      setSettingsOpen,
      toast,
      setOnline,
      reloadSession,
      clearSession,
    },
    messageActions,
    selectedId,
    listRef,
    openedAt,
    loadOlder,
    load,
    cancelReply,
  };
}
