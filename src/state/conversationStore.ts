import { create } from 'zustand';

import { fetchConversation, fetchOlder } from '../data/mockApi';
import { setSimulatedOnline } from '../data/network';
import { parseReply, replySources, visibleText, type Mode } from '../data/replies';
import type { Kundli } from '../domain/kundli';
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

export type { Mode } from '../data/replies';

type LoadStatus = 'loading' | 'ready' | 'error';

// Everything that belongs to one conversation. Every persona has one per mode.
type Session = {
  messages: Message[];
  status: LoadStatus;
  kundli: Kundli | null;
  hasOlder: boolean;
  olderPage: number;
};

type SessionKey = `${PersonaId}:${Mode}`;

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

  openChat: (personaId: PersonaId) => void;
  setMode: (mode: Mode) => void;
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

const freshSession = (mode: Mode): Session => ({
  messages: [],
  status: mode === 'demo' ? 'loading' : 'ready',
  kundli: null,
  hasOlder: mode === 'demo',
  olderPage: 0,
});

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

  const cancelInFlight = () => {
    inFlight.forEach((controller) => controller.abort());
    inFlight.clear();
  };

  // A parked session must not look busy, so unfinished work is settled first.
  const settle = (messages: Message[]): Message[] =>
    messages.map((message) => {
      if (message.type === 'user' && message.status === 'sending') {
        return { ...message, status: 'failed' };
      }
      if (message.type === 'ai' && message.isStreaming) {
        return { ...message, isStreaming: false };
      }
      return message;
    });

  /** Parks the current conversation and brings back (or starts) the one for this persona and mode. */
  const switchTo = (personaId: PersonaId, mode: Mode) => {
    const state = get();
    if (personaId === state.personaId && mode === state.mode) {
      return;
    }
    cancelInFlight();
    loadToken++;
    const { messages, status, kundli, hasOlder, olderPage } = state;
    const restored = state.parked[`${personaId}:${mode}`];
    set({
      ...(restored ?? freshSession(mode)),
      personaId,
      mode,
      parked: {
        ...state.parked,
        [`${state.personaId}:${state.mode}`]: { messages: settle(messages), status, kundli, hasOlder, olderPage },
      },
      isTyping: false,
      isLoadingOlder: false,
      replyingTo: null,
    });
  };

  /**
   * Gets a reply for everything up to this user message.
   * Sending… until the source accepts, then Sent and typing dots,
   * then the reply bubble grows as text streams in.
   */
  const deliver = async (id: string) => {
    const controller = new AbortController();
    inFlight.add(controller);
    const { signal } = controller;

    setStatus(id, 'sending');
    const replyId = nextId('ai');
    let started = false;

    try {
      const { messages, kundli, mode, personaId } = get();
      const history = messages.slice(0, messages.findIndex((message) => message.id === id) + 1);

      const raw = await replySources[mode]({
        persona: personas[personaId],
        messages: history,
        kundli,
        signal,
        onOpen: () => {
          if (signal.aborted) {
            return;
          }
          setStatus(id, 'sent');
          set({ isTyping: true });
        },
        onText: (text) => {
          if (signal.aborted) {
            return;
          }
          if (!started) {
            started = true;
            set((state) => ({
              isTyping: false,
              messages: [
                ...state.messages,
                { id: replyId, type: 'ai', text: '', createdAt: Date.now(), isStreaming: true },
              ],
            }));
          }
          patchAi(replyId, { text: visibleText(text) });
        },
      });

      if (!signal.aborted) {
        patchAi(replyId, { ...parseReply(raw, replyId), isStreaming: false });
      }
    } catch {
      if (signal.aborted) {
        return;
      }
      if (started) {
        patchAi(replyId, { isStreaming: false });
      } else {
        setStatus(id, 'failed');
      }
    } finally {
      inFlight.delete(controller);
      if (!signal.aborted && inFlight.size === 0) {
        set({ isTyping: false });
      }
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

    openChat: (personaId) => {
      switchTo(personaId, get().mode);
      if (get().status === 'loading') {
        get().load();
      }
    },

    setMode: (mode) => {
      switchTo(get().personaId, mode);
      if (get().status === 'loading') {
        get().load();
      }
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
        const messages = await fetchConversation();
        if (token === loadToken) {
          set({ messages, status: 'ready', hasOlder: true, olderPage: 0 });
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

    // Tapping the selected rating again clears it.
    rate: (id, rating) =>
      updateMessage(id, (message) => {
        if (message.type !== 'ai') {
          return message;
        }
        if (message.feedback?.rating === rating) {
          return { ...message, feedback: undefined };
        }
        const feedback: Feedback = rating === 'like' ? { rating: 'like' } : { rating: 'dislike', reasons: [] };
        return { ...message, feedback };
      }),

    toggleDislikeReason: (id, reason) =>
      updateMessage(id, (message) => {
        if (message.type !== 'ai' || message.feedback?.rating !== 'dislike') {
          return message;
        }
        const { reasons } = message.feedback;
        const next = reasons.includes(reason) ? reasons.filter((item) => item !== reason) : [...reasons, reason];
        return { ...message, feedback: { rating: 'dislike', reasons: next } };
      }),

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
