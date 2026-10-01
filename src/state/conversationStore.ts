import { create } from 'zustand';

import { fetchConversation, fetchOlder } from '../data/mockApi';
import { setSimulatedOnline } from '../data/network';
import { parseReply, replySources, visibleText, type Mode, type Speaker } from '../data/replies';
import { wait } from '../data/wait';
import { humanAstrologer } from '../domain/advisors';
import { slotLabel, type ConsultationBooking } from '../domain/consultation';
import type { Kundli } from '../domain/kundli';
import { applyRating, toggleReason } from '../domain/feedback';
import type {
  AiMessage,
  DeliveryStatus,
  DislikeReason,
  Feedback,
  Message,
  ReplyRef,
  UserMessage,
} from '../domain/message';
import { personas, type PersonaId } from '../domain/personas';
import { freshSession, sessionKey, settle, type Session, type SessionKey } from './session';

export type { Mode } from '../data/replies';

type ConversationState = Session & {
  personaId: PersonaId;
  mode: Mode;
  parked: Partial<Record<SessionKey, Session>>;
  /** The last kundli the user shared anywhere, used to prefill the form. */
  savedKundli: Kundli | null;
  isOnline: boolean;
  isTyping: boolean;
  isLoadingOlder: boolean;
  replyingTo: ReplyRef | null;

  openChat: (personaId: PersonaId, mode: Mode) => void;
  /** A brand new live conversation with this persona, replacing any earlier one. */
  startFreshChat: (personaId: PersonaId) => void;
  bookConsultation: (booking: ConsultationBooking) => Promise<void>;
  load: () => Promise<void>;
  loadOlder: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  attachKundli: (kundli: Kundli) => Promise<void>;
  retryMessage: (id: string) => Promise<void>;
  deleteMessage: (id: string) => void;
  rate: (id: string, rating: Feedback['rating']) => void;
  toggleDislikeReason: (id: string, reason: DislikeReason) => void;
  setReplyingTo: (reply: ReplyRef | null) => void;
  clearConversation: () => void;
  setOnline: (online: boolean) => void;
};

let localId = 0;
const nextId = (prefix: string) => `${prefix}-${++localId}`;

// Replies still streaming. Leaving a conversation cancels them.
const inFlight = new Set<AbortController>();

// Bumped on every load, so a slow response for a conversation you already left is ignored.
let loadToken = 0;

export const useConversationStore = create<ConversationState>((set, get) => {
  const updateMessage = (id: string, update: (message: Message) => Message) =>
    set((state) => ({
      messages: state.messages.map((message) => (message.id === id ? update(message) : message)),
    }));

  const setStatus = (id: string, status: DeliveryStatus) =>
    updateMessage(id, (message) => (message.type === 'user' ? { ...message, status } : message));

  const patchAi = (id: string, patch: Partial<AiMessage>) =>
    updateMessage(id, (message) => (message.type === 'ai' ? { ...message, ...patch } : message));

  const setText = (id: string, text: string) => updateMessage(id, (message) => ({ ...message, text }));

  const append = (message: Message) => set((state) => ({ messages: [...state.messages, message] }));

  const cancelInFlight = () => {
    inFlight.forEach((controller) => controller.abort());
    inFlight.clear();
  };

  /** Parks the current conversation and brings back (or starts) the one for this persona and mode. */
  const switchTo = (personaId: PersonaId, mode: Mode) => {
    const state = get();
    if (personaId === state.personaId && mode === state.mode) {
      return;
    }
    cancelInFlight();
    loadToken++;
    const { messages, status, kundli, hasOlder, olderPage } = state;
    const restored = state.parked[sessionKey(personaId, mode)];
    set({
      ...(restored ?? freshSession(mode)),
      personaId,
      mode,
      parked: {
        ...state.parked,
        [sessionKey(state.personaId, state.mode)]: { messages: settle(messages), status, kundli, hasOlder, olderPage },
      },
      isTyping: false,
      isLoadingOlder: false,
      replyingTo: null,
    });
  };

  /**
   * Streams one reply from the current source into a new message.
   * Typing dots once the source accepts, then the message grows as text arrives.
   * Returns 'failed' only when nothing arrived, so the caller can offer Retry.
   */
  const streamReply = async (
    speaker: Speaker,
    history: Message[],
    onAccepted: () => void,
  ): Promise<'done' | 'failed' | 'aborted'> => {
    const controller = new AbortController();
    inFlight.add(controller);
    const { signal } = controller;
    const isHuman = speaker.kind === 'human';
    const replyId = nextId(isHuman ? 'human' : 'ai');
    let started = false;

    try {
      const { kundli, mode, personaId } = get();
      const raw = await replySources[mode]({
        speaker,
        persona: personas[personaId],
        messages: history,
        kundli,
        signal,
        onOpen: () => {
          if (!signal.aborted) {
            onAccepted();
            set({ isTyping: true });
          }
        },
        onText: (text) => {
          if (signal.aborted) {
            return;
          }
          if (!started) {
            started = true;
            const createdAt = Date.now();
            set((state) => ({
              isTyping: false,
              messages: [
                ...state.messages,
                isHuman
                  ? { id: replyId, type: 'human', text: '', createdAt }
                  : { id: replyId, type: 'ai', text: '', createdAt, isStreaming: true },
              ],
            }));
          }
          setText(replyId, visibleText(text));
        },
      });

      if (signal.aborted) {
        return 'aborted';
      }
      const parsed = parseReply(raw, replyId);
      if (isHuman) {
        setText(replyId, parsed.text);
      } else {
        patchAi(replyId, { ...parsed, isStreaming: false });
      }
      return 'done';
    } catch {
      if (signal.aborted) {
        return 'aborted';
      }
      if (started) {
        patchAi(replyId, { isStreaming: false });
        return 'done';
      }
      return 'failed';
    } finally {
      inFlight.delete(controller);
      if (!signal.aborted && inFlight.size === 0) {
        set({ isTyping: false });
      }
    }
  };

  /** Sending… until the source accepts, then Sent; Failed (with Retry) if no reply arrives. */
  const deliver = async (id: string) => {
    setStatus(id, 'sending');
    const { messages } = get();
    const history = messages.slice(0, messages.findIndex((message) => message.id === id) + 1);
    const result = await streamReply({ kind: 'persona' }, history, () => setStatus(id, 'sent'));
    if (result === 'failed') {
      setStatus(id, 'failed');
    }
  };

  const appendUserMessage = (fields: Pick<UserMessage, 'text' | 'replyTo' | 'attachment'>) => {
    const id = nextId('user');
    const now = Date.now();
    set((state) => {
      // A new chat opens with a system event, like the brief's first message.
      const opening: Message[] =
        state.messages.length === 0
          ? [
              {
                id: nextId('system'),
                type: 'system',
                text: `Your session with ${personas[state.personaId].name} has started.`,
                createdAt: now,
              },
            ]
          : [];
      return {
        messages: [...state.messages, ...opening, { ...fields, id, type: 'user', createdAt: now, status: 'sending' }],
        replyingTo: null,
      };
    });
    return id;
  };

  return {
    ...freshSession('demo'),
    personaId: 'dhuni-baba',
    mode: 'demo',
    parked: {},
    savedKundli: null,
    isOnline: true,
    isTyping: false,
    isLoadingOlder: false,
    replyingTo: null,

    openChat: (personaId, mode) => {
      switchTo(personaId, mode);
      if (get().status === 'loading') {
        get().load();
      }
    },

    startFreshChat: (personaId) => {
      switchTo(personaId, 'live');
      cancelInFlight();
      loadToken++;
      set({ ...freshSession('live'), isTyping: false, replyingTo: null });
    },

    /** A note in the chat, then the human astrologer joins and says hello in her own words. */
    bookConsultation: async (booking) => {
      const token = loadToken;
      append({
        id: nextId('system'),
        type: 'system',
        text: `Call booked with ${humanAstrologer.name} · ${slotLabel(booking.startsAt)} · ${booking.minutes} min`,
        createdAt: Date.now(),
      });
      await wait(1200);
      // The user may have left this conversation while we waited.
      if (token !== loadToken) {
        return;
      }
      append({ id: nextId('system'), type: 'system', text: `${humanAstrologer.name} joined the chat`, createdAt: Date.now() });
      await streamReply({ kind: 'human', booking }, get().messages, () => {});
    },

    load: async () => {
      cancelInFlight();
      if (get().mode === 'live') {
        set(freshSession('live'));
        return;
      }
      const token = ++loadToken;
      set({ status: 'loading' });
      try {
        const { messages, kundli } = await fetchConversation(get().personaId);
        if (token === loadToken) {
          set({ messages, kundli, status: 'ready', hasOlder: true, olderPage: 0 });
        }
      } catch {
        if (token === loadToken) {
          set({ status: 'error' });
        }
      }
    },

    loadOlder: async () => {
      const { hasOlder, isLoadingOlder, olderPage, status, mode } = get();
      if (mode !== 'demo' || !hasOlder || isLoadingOlder || status !== 'ready') {
        return;
      }
      const token = loadToken;
      set({ isLoadingOlder: true });
      try {
        const page = await fetchOlder(olderPage);
        if (token === loadToken) {
          set((state) => ({
            messages: [...page.messages, ...state.messages],
            hasOlder: page.hasMore,
            olderPage: state.olderPage + 1,
          }));
        }
      } catch {
        return;
      } finally {
        set({ isLoadingOlder: false });
      }
    },

    sendMessage: async (text) => {
      const id = appendUserMessage({ text, replyTo: get().replyingTo ?? undefined });
      await deliver(id);
    },

    attachKundli: async (kundli) => {
      set({ kundli, savedKundli: kundli });
      const id = appendUserMessage({
        text: 'Here are my birth details.',
        attachment: { kind: 'kundli', kundli },
      });
      await deliver(id);
    },

    retryMessage: async (id) => {
      const message = get().messages.find((item) => item.id === id);
      if (message?.type === 'user' && message.status === 'failed') {
        await deliver(id);
      }
    },

    deleteMessage: (id) =>
      set((state) => ({
        messages: state.messages.filter((message) => message.id !== id),
        replyingTo: state.replyingTo?.id === id ? null : state.replyingTo,
      })),

    rate: (id, rating) =>
      updateMessage(id, (message) =>
        message.type === 'ai' ? { ...message, feedback: applyRating(message.feedback, rating) } : message,
      ),

    toggleDislikeReason: (id, reason) =>
      updateMessage(id, (message) =>
        message.type === 'ai' ? { ...message, feedback: toggleReason(message.feedback, reason) } : message,
      ),

    setReplyingTo: (replyingTo) => set({ replyingTo }),

    clearConversation: () => {
      cancelInFlight();
      loadToken++;
      set({ ...freshSession(get().mode), status: 'ready', hasOlder: false, isTyping: false, replyingTo: null });
    },

    setOnline: (online) => {
      setSimulatedOnline(online);
      set({ isOnline: online });
    },
  };
});
