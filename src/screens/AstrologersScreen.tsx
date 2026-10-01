import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Bell, Search } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BadgeIconButton } from '../components/astrologers/BadgeIconButton';
import { ChatRow } from '../components/astrologers/ChatRow';
import { NewChatRow } from '../components/astrologers/NewChatRow';
import { LabelledDivider, SectionHeader } from '../components/astrologers/SectionHeader';
import { TabBar } from '../components/astrologers/TabBar';
import { BrandLogo } from '../components/BrandLogo';
import { PAGE_MAX_WIDTH } from '../components/layout';
import { PersonaPickerSheet } from '../components/sheets/PersonaPickerSheet';
import { Toast } from '../components/Toast';
import { personaList, type PersonaId } from '../domain/personas';
import type { RootStackParamList } from '../navigation/types';
import { useConversationStore } from '../state/conversationStore';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Astrologers'>;

const SOON = 'Coming soon';

// Store actions never change, so they are read once instead of subscribed to.
const actions = useConversationStore.getState();

export function AstrologersScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<string | null>(null);
  const hideToast = useCallback(() => setToast(null), []);
  const soon = () => setToast(SOON);
  const [pickerOpen, setPickerOpen] = useState(false);

  const startLiveChat = (personaId: PersonaId) => {
    setPickerOpen(false);
    actions.startFreshChat(personaId);
    navigation.navigate('Chat', { personaId, mode: 'live' });
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <View style={styles.topBarInner}>
          <BrandLogo />
          <BadgeIconButton icon={Bell} label="Notifications" onPress={soon} badge />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          onPress={soon}
          accessibilityRole="search"
          style={({ pressed }) => [styles.search, pressed && styles.pressed]}
        >
          <Search size={17} color={colors.faint} strokeWidth={1.75} />
          <Text style={styles.searchText}>Search astrologers</Text>
        </Pressable>

        <SectionHeader title="Simulated chats" caption="Complete sessions that show everything a chat can do" />
        {personaList.map((persona) => (
          <ChatRow
            key={persona.id}
            persona={persona}
            mode="demo"
            onPress={() => navigation.navigate('Chat', { personaId: persona.id, mode: 'demo' })}
          />
        ))}

        <LabelledDivider label="Live" />

        <SectionHeader title="Live chat" caption="Your own conversation, written by the model as you go" />
        {personaList.map((persona) => (
          <ChatRow
            key={persona.id}
            persona={persona}
            mode="live"
            hideWhenEmpty
            onPress={() => navigation.navigate('Chat', { personaId: persona.id, mode: 'live' })}
          />
        ))}
        <NewChatRow onPress={() => setPickerOpen(true)} />

        <Text style={styles.disclaimer}>
          Parody AI personas made for a demo. Not affiliated with or endorsed by Chhota Bheem, Kantara or Sanjay Dutt.
        </Text>
      </ScrollView>

      <TabBar bottomInset={insets.bottom} onDummyTab={soon} />
      <Toast message={toast} onHide={hideToast} />
      <PersonaPickerSheet visible={pickerOpen} onClose={() => setPickerOpen(false)} onPick={startLiveChat} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  topBarInner: {
    width: '100%',
    maxWidth: PAGE_MAX_WIDTH,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.6,
  },
  content: {
    width: '100%',
    maxWidth: PAGE_MAX_WIDTH,
    alignSelf: 'center',
    paddingBottom: 24,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 4,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  searchText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.faint,
  },
  disclaimer: {
    marginTop: 24,
    paddingHorizontal: 32,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
    color: colors.faint,
    textAlign: 'center',
  },
});
