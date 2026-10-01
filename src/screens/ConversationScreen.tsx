import type { ReactNode } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import { Composer } from '../components/Composer';
import { ConversationHeader } from '../components/ConversationHeader';
import { ConversationList } from '../components/ConversationList';
import { EmptyState, LoadError, LoadingSkeleton } from '../components/ConversationStates';
import { MessageMenu } from '../components/messages/MessageMenu';
import { KundliSheet } from '../components/sheets/KundliSheet';
import { RecommendationSheet } from '../components/sheets/RecommendationSheet';
import { SettingsSheet } from '../components/sheets/SettingsSheet';
import { Toast } from '../components/Toast';
import { firstName } from '../domain/kundli';
import { getPersona, type Persona } from '../domain/personas';
import type { RootStackParamList } from '../navigation/types';
import type { Mode } from '../state/conversationStore';
import type { LoadStatus } from '../state/session';
import { colors } from '../theme/colors';
import { useConversationScreen } from './useConversationScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export function ConversationScreen({ route, navigation }: Props) {
  const persona = getPersona(route.params.personaId);
  const mode: Mode = route.params.mode === 'live' ? 'live' : 'demo';
  const {
    session,
    send,
    shareKundli,
    openKundli,
    kundliOpen,
    setKundliOpen,
    overlays,
    messageActions,
    selectedId,
    listRef,
    openedAt,
    loadOlder,
    load,
    cancelReply,
  } = useConversationScreen(persona, mode);
  const { status, messages, kundli, savedKundli, isOnline, isTyping, hasOlder, isLoadingOlder, replyingTo } = session;

  return (
    // Padding on Android too: edge-to-edge (forced from Android 15) means the window no longer resizes for the keyboard.
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <ConversationHeader
        persona={persona}
        mode={mode}
        isOnline={isOnline}
        isTyping={isTyping}
        chartOwner={kundli ? firstName(kundli) : null}
        onBack={navigation.goBack}
        onProfilePress={() => navigation.navigate('Profile', { personaId: persona.id })}
        onMenuPress={() => overlays.setSettingsOpen(true)}
      />

      <ConversationBody
        status={status}
        isEmpty={messages.length === 0}
        persona={persona}
        onRetry={load}
        onSuggestionPress={send}
        onShareKundli={openKundli}
      >
        <ConversationList
          ref={listRef}
          mode={mode}
          messages={messages}
          persona={persona}
          kundli={kundli}
          savedKundli={savedKundli}
          isTyping={isTyping}
          hasOlder={hasOlder}
          isLoadingOlder={isLoadingOlder}
          selectedId={selectedId}
          openedAt={openedAt}
          messageActions={messageActions}
          onLoadOlder={loadOlder}
        />
      </ConversationBody>

      <Composer
        onSend={send}
        disabled={status !== 'ready'}
        replyingTo={replyingTo}
        onCancelReply={cancelReply}
        onAttachPress={openKundli}
        hasKundli={kundli !== null}
        placeholder={persona.placeholder}
      />
      <Toast message={overlays.toast.message} onHide={overlays.toast.hide} />

      <MessageMenu target={overlays.menu} onClose={() => overlays.setMenu(null)} onAction={overlays.onMessageAction} />
      <RecommendationSheet recommendation={overlays.selectedCard} actions={overlays.cardActions} />
      <KundliSheet
        visible={kundliOpen}
        initial={kundli ?? savedKundli}
        onClose={() => setKundliOpen(false)}
        onAttach={shareKundli}
      />
      <SettingsSheet
        visible={overlays.settingsOpen}
        mode={mode}
        isOnline={isOnline}
        onClose={() => overlays.setSettingsOpen(false)}
        onToggleOnline={overlays.setOnline}
        onReload={overlays.reloadSession}
        onClear={overlays.clearSession}
      />
    </KeyboardAvoidingView>
  );
}

function ConversationBody({
  status,
  isEmpty,
  persona,
  onRetry,
  onSuggestionPress,
  onShareKundli,
  children,
}: {
  status: LoadStatus;
  isEmpty: boolean;
  persona: Persona;
  onRetry: () => void;
  onSuggestionPress: (text: string) => void;
  onShareKundli: () => void;
  children: ReactNode;
}) {
  if (status === 'loading') {
    return <LoadingSkeleton />;
  }
  if (status === 'error') {
    return <LoadError onRetry={onRetry} />;
  }
  if (isEmpty) {
    return <EmptyState persona={persona} onSuggestionPress={onSuggestionPress} onShareKundli={onShareKundli} />;
  }
  return children;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
