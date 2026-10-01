# MyNaksh

AI conversation experience for the MyNaksh frontend assessment. Pick one of three AI astrologers, each with a profile and a voice of their own, and chat. They talk like people and bring up UI (forms, cards, quick replies) when the conversation needs it.

## The astrologers

| | Dhuni Baba 🪔 | Kantara 🐗 | Sanju Baba 🤗 |
| --- | --- | --- | --- |
| Inspired by | Chhota Bheem | Kantara | Sanjay Dutt (Munna Bhai style) |
| Vibe | Gentle grandfather sage, tiny Dholakpur stories | Few words, total seriousness, forest imagery | Big-hearted Bambaiya, planets are "bhais" |
| Fee | 2 laddoos / chat | 1 promise, kept | 1 jaadu ki jhappi |

All three are parody personas, labelled as such in the app. Their avatars live in `assets/images` as 512px square JPEGs cropped to the face.

**How a persona is built** (`domain/personas.ts`): one data object holds the profile (bio, stats, reviews, fee, specialties), the theme colors, the `voice` prompt with a few example lines, and the demo-mode lines. Adding a fourth persona means adding one object; the list, profile, chat and both reply sources pick it up.

**Keeping them human**: every persona's voice is wrapped in shared rules. Talk like a real person texting, one to three sentences, comfort before questions, catchphrases used sparingly, never copy the example lines.

## Two modes

Switch with the **Demo / Live** toggle in the chat header. Every persona keeps its own conversation per mode (six in total), so switching persona or mode loses nothing.

| | Demo | Live |
| --- | --- | --- |
| Starts with | The brief's mock payload, plus two pages of older history | An empty conversation |
| Replies from | A local script that streams like the real thing | A real model through OpenRouter |
| Needs an API key | No | Yes |
| Good for | Showing every feature in a predictable order | Actually talking to the astrologers |

## Screens

`Astrologers` (home) → `Profile` → `Chat`, on a React Navigation native stack. Each screen also has a URL on the web (`/`, `/astrologer/kantara`, `/chat/sanju-baba`), so refresh and shared links work.

## Run

Live mode needs an OpenRouter key. It stays in a small proxy (`server/proxy.mjs`) and is never bundled into the app. Demo mode works without it.

```bash
cp .env.example .env        # then paste your OPENROUTER_API_KEY into .env
```

**Docker** (one command):

```bash
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080). The app is on 8080 and the chat proxy on 8787.

**Local development** (Node 22.13 or newer):

```bash
npm install
npm run dev          # proxy on :8787 + Expo web
```

`npm run ios` and `npm run android` open a simulator when one is installed. Set `EXPO_PUBLIC_API_URL` to your machine's LAN address so a phone can reach the proxy.

**Vercel**: import the repo and add `OPENROUTER_API_KEY` (and optionally `OPENROUTER_MODEL`) under Environment Variables. `vercel.json` builds the web export into `dist`, serves `api/chat.mjs` as a streaming function at `/api/chat`, and rewrites every other path to `index.html` for client-side routes. The production web build calls `/api/chat` on the same domain, so there is no CORS and no key in the bundle. `server/openrouter.mjs` is shared by the Vercel function and the local proxy.

## Stack

- Expo SDK 57 (React Native 0.86) and TypeScript
- React Navigation native stack
- React Native Reanimated
- Zustand
- `react-native-svg` for the kundli chart, `expo-clipboard` for copy

Expo is the runnable shell so a reviewer can open the app in a browser. The UI is React Native, not a separate web app.

## Project structure

```text
assets/images/           card artwork and the human astrologer portrait (generated with ChatGPT)
api/                     Vercel function: /api/chat
server/                  OpenRouter helper and the local proxy (same behaviour as the function)
src/
  components/            header, composer, avatar, chip, sheet, toast, loading / empty / error states
  components/messages/   message row, user bubble, advisor message, feedback, reply widgets, typing
  components/kundli/     kundli form, chart (SVG) and the attachment card
  components/sheets/     kundli, long-press actions, card detail, session options
  data/                  mock conversation and history, simulated network
  data/replies/          reply format, live source (OpenRouter), demo source (script)
  domain/                messages, recommendations, kundli, personas, human astrologer
  navigation/            root stack and web URLs
  recommendations/       type → card registry and per-type appearance
  screens/               astrologer list, persona profile, chat
  state/                 Zustand store and the timeline builder
  theme/                 color and typography tokens
```

## Component architecture

```text
AstrologersScreen            persona cards → Profile or Chat
PersonaProfileScreen         hero, stats, about, how he talks, specialties, details, reviews, sticky CTA
ConversationScreen
├── ConversationHeader       back, persona (tap → profile), status, Demo / Live switch, ••• menu
├── LoadingSkeleton | LoadError | EmptyState
├── FlatList (inverted)
│   ├── DaySeparator
│   ├── MessageRow (memo)    switches on message.type
│   │   ├── SystemNote
│   │   ├── UserBubble       kundli card, reply quote, Sending… / Sent / Failed + Retry
│   │   └── AdvisorMessage   the AI persona and the human astrologer share this layout
│   │       ├── recommendation rail → resolveRecommendationCard(type)
│   │       ├── MessageWidgets   inline kundli form, quick replies
│   │       └── FeedbackBar      👍 / 👎 → dislike reasons
│   └── TypingIndicator      list header, so it sits at the bottom
├── Composer                 ＋ attach kundli, reply preview, input
└── Sheets                   KundliSheet, MessageActionsSheet, RecommendationSheet, SettingsSheet
```

- **The screen does the wiring.** It reads the store, holds UI-only state (which sheet is open, the toast) and passes callbacks down.
- **Rows are presentational.** They get a message and callbacks and never touch the store.
- **`KundliForm` is used twice**: inside the bottom sheet, and inline in the chat when an astrologer asks for birth details.
- **`Sheet`** is one bottom-sheet primitive (Modal plus a Reanimated spring) that every sheet is built on.
- **Persona flows down as a prop.** A session belongs to one persona, so the screen passes it to rows, the typing indicator, the empty state and the composer placeholder.

## State management

**Zustand** (`state/conversationStore.ts`): one small store with no providers, and actions are plain async functions.

- **Session state**: `messages` (oldest first), `status` (`loading | ready | error`), `kundli`, `hasOlder`, `olderPage`.
- **App state**: `personaId`, `mode`, `savedKundli` (prefills the form for the next persona), `isOnline`, `isTyping`, `isLoadingOlder`, `replyingTo`.
- **Sessions are parked by key** (`'kantara:live'`). `openChat` and `setMode` both call `switchTo`. It cancels streaming replies, settles unfinished work (sending → failed, streaming → done), parks the current session and restores the target one, or starts it fresh.
- **Stale loads are ignored**: each load takes a token, and a response that comes back after you have moved on is dropped.
- **Optimistic send**: the user message is added as `sending`. It becomes `sent` when the reply source accepts the request, and typing dots show. The first token creates the AI message (`isStreaming: true`), later tokens update its text, and at the end the text is split from cards and widgets. If nothing arrives, the message becomes `failed`, and Retry runs the same `deliver` function.
- **Cancellation**: each reply has an `AbortController`. Switching mode or clearing the chat aborts all of them, and aborted replies never write into the other conversation.
- **Feedback** is a union: `{ rating: 'like' }` or `{ rating: 'dislike', reasons }`, so a like can never carry reasons.
- **Reply** saves a copy of the quoted message (`ReplyRef`), so the quote survives deleting the original.
- **`state/timeline.ts`** is a pure function. It adds day separators and marks each message as the start or end of a group (same sender within 5 minutes). It is derived data, so it lives in `useMemo`, not the store.

## The AI (kept simple)

There is no agent framework: one system prompt (persona voice plus shared rules) and one streaming request per message.
- **UI from the reply**: the model writes normal text, then optionally `⟦UI⟧` and a JSON object:
  ```json
  { "form": "kundli", "cards": [{ "type": "gemstone", "title": "Blue Sapphire" }], "replies": ["Career", "Love"] }
  ```
  - `form` shows the inline kundli form, used when the astrologer needs birth details.
  - `cards` become recommendation cards through the normal registry.
  - `replies` become tap-to-send chips. They show only under the latest message, since older suggestions answer a question that has moved on.
- **One format, two sources**: `data/replies/protocol.ts` defines the format and the parser. `liveReply` streams from OpenRouter and `demoReply` streams the persona's scripted lines. The store picks one by mode, and the UI never knows which one answered.
- **Safe parsing**: while streaming, everything after the marker is hidden. At the end the JSON is validated, and bad JSON just means no extra UI.
- **Context**: the last 20 messages go to the model. Quoted replies and an attached kundli are written into the text, and a shared kundli also goes into the system prompt.
- **Streaming** uses `expo/fetch`, which gives a readable response stream on iOS, Android and web.
- **Model**: `anthropic/claude-haiku-4.5` by default, which can be changed with `OPENROUTER_MODEL` in `.env`.

## Kundli

- **Two ways in**: tap ＋ in the composer, or let the astrologer ask for it with the inline form.
- **The form**: typed digits become `DD / MM / YYYY` and `HH:MM`. There is an "I don't know my birth time" switch and quick city chips. A live chart preview fills in as you type, and submit stays disabled until everything is valid.
- **After sharing**: the user's bubble shows a card with a North Indian diamond chart, the name, the sidereal Sun sign and the birth details. The inline form collapses to "✓ Kundli shared", the header reads "Reading Sarath's chart", and the details go into the prompt.
- **The chart is a Surya chart** (Sun sign in house 1). It needs only the date, so the UI never pretends to compute a full chart.

## Recommendation rendering strategy

1. **Data**: `Recommendation = { id, type, title, subtitle? }`. `type` is `KnownRecommendationType | (string & {})`, which gives autocomplete for known types but still accepts unknown strings from the backend or the model.
2. **Registry** (`recommendations/registry.ts`): a `Map<type, Component>`. `resolveRecommendationCard(type)` returns the registered card, or `FallbackCard` for anything unknown, so a new type never crashes the chat. "Moon Meditation" shows this.
3. **Appearance** (`recommendations/appearance.ts`): a map from type to label, glyph, colors, artwork, blurb and call to action. Most types share one card and differ only by this data.

**Adding a type** takes one entry in `KNOWN_RECOMMENDATION_TYPES` and one in the appearance map; that is how Panchang and Remedy were added. The live prompt lists the known types automatically, so the model can use a new type straight away. A type that needs a different UI registers its own component with `registerRecommendation`.

**Reply widgets** follow the same idea: `ReplyWidget` is a union, and `MessageWidgets` has one `case` per kind.

## Performance considerations

- **Virtualized `FlatList`**: `initialNumToRender={12}`, `maxToRenderPerBatch={8}`, `windowSize={11}`, and `removeClippedSubviews` on Android.
- **Inverted list**: the newest message sits at offset 0, so auto-scroll to latest needs no `scrollToEnd` timing hacks, and "load older" is a normal `onEndReached`.
- **`maintainVisibleContentPosition`** keeps the reading position steady when a message is deleted or history is prepended.
- **Memoised rows, stable callbacks**: actions are read once from the store, and the screen subscribes with a shallow selector. While a reply streams, only that row re-renders.
- **Animations run on the UI thread** (Reanimated). Only messages created after the screen opened animate in.
- **Images** are resized JPEGs, about 1.4 MB in total.

## Feature checklist

| Brief | Where |
| --- | --- |
| User / AI / Human / System messages | `components/messages/` |
| Virtualized list, auto-scroll, date separators, grouping | `ConversationScreen`, `state/timeline.ts` |
| Multiple horizontal recommendation cards, extensible | `recommendations/` |
| Long-press: Reply, Copy, Delete | `MessageActionsSheet` (Retry also offered on failed sends) |
| Reply preview above the composer | `Composer` |
| 👍 Like / 👎 Dislike, then Inaccurate / Too Generic / Didn't Help / Too Long | `FeedbackBar` |
| Optimistic send with Sending… / Sent / Failed / Retry | store `deliver`, `UserBubble` |
| Loading, Empty, Network failure + Retry | `ConversationStates.tsx` (demo reload, live empty start) |

**Trying it**: in Demo, ask about career before sharing a kundli; the astrologer asks for it with the inline form. Then tap a quick reply. Use ••• to simulate offline, reload (loading or error) or clear the chat. With a mouse, long-press means press and hold.

## Trade-offs

- **Expo instead of the bare React Native CLI**, so a reviewer can run it in a browser or with Docker. The code is plain React Native, and `expo prebuild` produces native projects.
- **Nothing is persisted.** Each mode's conversation lives in memory, so a reload starts over. A real app would store messages and queue failed sends.
- **Simulated offline mode** instead of NetInfo, so the failure paths can be shown on demand.
- **A proxy instead of a backend.** It is just enough to keep the key off the client. There is no auth or rate limiting, so a public deployment should add both before sharing the link widely.
- **A text marker plus JSON instead of tool calling.** It streams naturally and works with any model. Tool calls would be stricter, but they add a round trip and more code.
- **The Sun sign is approximate** (fixed ingress dates, about a day either side), and no full chart is calculated.
- **Card taps open a detail sheet with a toast**, not real booking or purchase flows.
- **No automated tests yet.** `buildTimeline`, `parseReply` and the store actions are the first to add.
