# MyNaksh

AI conversation experience for the MyNaksh frontend assessment. Pick one of three AI astrologers, each with a profile and a voice of their own, and chat. They talk like people and bring up UI (forms, cards, quick replies) when the conversation needs it.

## The astrologers

| | Dhuni Baba 🪔 | Kantara 🐗 | Sanju Baba 🤗 |
| --- | --- | --- | --- |
| Inspired by | Chhota Bheem | Kantara | Sanjay Dutt (Munna Bhai style) |
| Vibe | Gentle grandfather sage, tiny Dholakpur stories | Few words, total seriousness, forest imagery | Big-hearted Bambaiya, planets are "bhais" |
| Fee | 2 laddoos / chat | 1 promise, kept | 1 jaadu ki jhappi |

All three are parody personas, labelled as such in the app. Their avatars live in `assets/images` as 512px square JPEGs cropped to the face.

**How a persona is built** (`domain/personas/`): one file per persona holds the profile (bio, stats, reviews, fee, specialties), the theme colors, the `voice` prompt with a few example lines, and the demo-mode lines. Adding a fourth persona means one new file, its id in `PersonaId`, and one line in `personas/index.ts`; the list, profile, chat and both reply sources pick it up.

**Keeping them human**: every persona's voice is wrapped in shared rules. Talk like a real person texting, one to three sentences, comfort before questions, catchphrases used sparingly, never copy the example lines.

## Simulated and live chats

The home screen has two sections, split by a divider.

| | Simulated chats | Live chat |
| --- | --- | --- |
| What it is | One complete, hand-written session per persona | Your own fresh conversation with a persona you pick |
| Starts with | The full session, plus older history (the brief's payload first) | An empty chat |
| Replies from | A local script that streams like the real thing | A real model through OpenRouter |
| Needs an API key | No | Yes |
| Shows | Every experience, in each persona's voice | Whatever the model chooses, every value written by the model |

Each persona keeps one conversation per mode, so moving between chats loses nothing. "Start a new live chat" always starts empty. The chat header shows a *Simulated* or *Live* badge.

**The three simulated sessions** show different things: Dhuni Baba (career) has birth details, chart analysis, tarot, remedies, muhurat, panchang, a booked call with the human astrologer, and a summary. Kantara (a land dispute) has a reversed tarot card, a yantra, an emerald, a puja, signing dates and an article. Sanju Baba (a breakup) has compatibility, Moon remedies, a horoscope and a 45-minute call.

## Experiences in the chat

| Experience | How it shows | Interaction |
| --- | --- | --- |
| Birth details | Inline form, then a "Shared" receipt | Live chart preview while typing |
| Chart analysis | Card: placements grid, strengths, challenges | — |
| Tarot | Three face-down cards | Tap to flip; reversed cards are drawn upside down; meanings build up underneath |
| Panchang | Card: tithi, nakshatra, yoga, sunrise and sunset, good hours, Rahu Kaal | — |
| Gemstone and other products | Card with the stone's artwork (picked by key from the Navaratna set) | Sheet with why and facts (planet, finger, metal, day, weight) |
| Mantra | Card, then a sheet with the chant in large type | Tap the bead to count to 108 |
| Remedy and meditation | Sheet with steps | Tick off steps as you do them |
| Muhurat | Sheet with dated windows | Pick one to set a reminder |
| Consultation | Sheet: how it works, then today's slots (computed) | Booking adds a note; Acharya Meera joins the chat and writes her own hello |
| Tarot, panchang, compatibility cards | Card | The call to action asks the astrologer, so the chat moves on |
| Summary | Card at the end of a session | Points to feedback |

**Dynamic, not hard-coded**: in live mode every card, reading and value comes from the model (Ruby or Sapphire, which tarot cards, which dates). The app only owns the artwork, which the model picks by key; an unknown key falls back to the type's symbol.

## Screens

`Astrologers` (home) → `Profile` → `Chat`, on a React Navigation native stack. Each screen also has a URL on the web (`/`, `/astrologer/kantara`, `/chat/demo/sanju-baba`, `/chat/live/kantara`), so refresh and shared links work.

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
assets/images/           card artwork, gems/ (Navaratna) and tarot/ (Major Arcana + card back), all generated with ChatGPT
api/                     Vercel function: /api/chat
server/                  OpenRouter helper and the local proxy (same behaviour as the function)
src/
  components/            header, composer, avatar, chip, sheet, toast, loading / empty / error states
  components/messages/   message row, user bubble, advisor message, feedback, reply widgets, typing
  components/kundli/     kundli form, chart (SVG) and the attachment card
  components/sheets/     kundli, card detail, session options
  components/astrologers/  home list row, tab bar, top-bar icon button
  components/profile/    profile sections: stat, section, detail, review
  data/                  mock conversation and history, simulated network
  data/replies/          protocol (format + parser), session arc, prompt builder, SSE reader, live source, demo script + source
  data/simulated/        the three hand-written persona sessions, built through the real reply parser
  data/samples.ts        sample cards and readings shared by the demo script and the simulated chats
  media/                 image sets the model picks from by key (gems, tarot)
  lib/                   safe readers for model-written JSON
  domain/                messages, feedback rules, recommendations, kundli, personas/ (one file each), human astrologer
  navigation/            root stack and web URLs
  recommendations/       grouped catalog (catalog/<group>.ts), type → card registry, card and rail, details/ (per-type sheets)
  screens/               astrologer list, persona profile, chat
  state/                 Zustand store, session helpers, selectors and the timeline builder
  widgets/               reply widgets: kinds/ (parse, encode, prompt per kind), components, registry
  theme/                 color and typography tokens
```

## Component architecture

```text
AstrologersScreen            persona cards → Profile or Chat
PersonaProfileScreen         hero, stats, about, how he talks, specialties, details, reviews, sticky CTA
ConversationScreen
├── ConversationHeader       back, persona (tap → profile), status, Simulated / Live badge, ••• menu
├── LoadingSkeleton | LoadError | EmptyState
├── FlatList (inverted)
│   ├── DaySeparator
│   ├── MessageRow (memo)    switches on message.type
│   │   ├── SystemNote
│   │   ├── UserBubble       kundli card, reply quote, Sending… / Sent / Failed + Retry
│   │   └── AdvisorMessage   the AI persona and the human astrologer share this layout
│   │       ├── recommendation rail → resolveRecommendationCard(type)
│   │       ├── WidgetList       inline kundli form, quick replies (widgets/registry)
│   │       └── FeedbackBar      👍 / 👎 → dislike reasons
│   └── TypingIndicator      list header, so it sits at the bottom
├── Composer                 ＋ attach kundli, reply preview, input
└── Sheets                   KundliSheet, RecommendationSheet, SettingsSheet, plus MessageMenu (long-press)
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

There is no agent framework: one system prompt (persona voice, shared rules, the session arc and the UI guide) and one streaming request per message.
- **Session arc** (`data/replies/arc.ts`): take details → first analysis → find the problem → go deeper (tarot) → remedies → timing → offer the human astrologer → summary. A pure function works out which stages the conversation has already covered from what was shown, and each request tells the model the next one to aim for and what not to repeat. It guides the model; it doesn't script it.
- **UI from the reply**: the model writes normal text, then optionally `⟦UI⟧` and a JSON object:
  ```json
  { "cards": [{ "type": "gemstone", "title": "Ruby", "image": "ruby", "why": "…", "facts": [{ "label": "Finger", "value": "Ring" }] }],
    "tarot": { "cards": [{ "name": "The Star", "position": "Future", "reversed": false, "meaning": "…" }] },
    "replies": ["Tell me more", "What else?"] }
  ```
  - `form` shows the inline kundli form, used when the astrologer needs birth details.
  - `cards` become recommendation cards through the normal registry. Each card can carry `image`, `why`, `facts` and type-specific `extra` fields (mantra text, remedy steps, muhurat dates, call length).
  - `analysis`, `tarot`, `panchang` and `summary` become inline reading widgets.
  - `replies` become tap-to-send chips. They show only under the latest message, since older suggestions answer a question that has moved on.
- **One format, two sources**: `data/replies/protocol.ts` defines the format, the encoder and the parser. `prompt.ts` builds the system prompt; its card and widget sections are generated from the catalog and widget definitions. `liveReply` streams from OpenRouter and `demoReply` streams the persona's scripted lines. The store picks one by mode, and the UI never knows which one answered.
- **Safe parsing**: while streaming, everything after the marker is hidden. At the end the JSON is validated, and bad JSON just means no extra UI.
- **Context**: the last 24 messages go to the model, each AI turn noting which cards and widgets it showed. Quoted replies and an attached kundli are written into the text, and a shared kundli also goes into the system prompt.
- **Streaming** uses `expo/fetch`, which gives a readable response stream on iOS, Android and web.
- **Model**: `anthropic/claude-haiku-4.5` by default, which can be changed with `OPENROUTER_MODEL` in `.env`.

## Kundli

- **Two ways in**: tap ＋ in the composer, or let the astrologer ask for it with the inline form.
- **The form**: typed digits become `DD / MM / YYYY` and `HH:MM`. There is an "I don't know my birth time" switch and quick city chips. A live chart preview fills in as you type, and submit stays disabled until everything is valid.
- **After sharing**: the user's bubble shows a card with a North Indian diamond chart, the name, the sidereal Sun sign and the birth details. The inline form collapses to "✓ Kundli shared", the header reads "Reading Sarath's chart", and the details go into the prompt.
- **The chart is a Surya chart** (Sun sign in house 1). It needs only the date, so the UI never pretends to compute a full chart.

## Recommendation rendering strategy

1. **Data**: `Recommendation = { id, type, title, subtitle? }`. `type` is `KnownRecommendationType | (string & {})`, which gives autocomplete for known types but still accepts unknown strings from the backend or the model.
2. **Catalog** (`recommendations/catalog/`): one file per group, each a map from type to label, glyph, colors, optional artwork, blurb, call to action and a `hint` for the model. `KnownRecommendationType` is derived from the catalog's keys.

   | Group | Types |
   | --- | --- |
   | Readings | tarot, horoscope, compatibility, consultation |
   | Rituals | remedy, mantra, meditation, puja |
   | Products | gemstone, rudraksha, yantra |
   | Timing | panchang, muhurat |
   | Learn | article |
   | Offers | promotion |

3. **Registry** (`recommendations/registry.ts`): a `Map<type, Component>`. `resolveRecommendationCard(type)` returns the registered card, or `FallbackCard` for anything unknown, so a new type never crashes the chat. "Dream Journal" in the older history shows this.

**Adding a type** takes one entry in its group file. **Adding a group** takes a new file in `catalog/`, an id in `ExperienceGroupId`, and an entry in `groups.ts`. The live prompt lists the types by group with their hints, so the model can use a new type straight away. A type that needs a different UI registers its own component with `registerRecommendation`.

**Reply widgets** follow the same idea: `ReplyWidget` is a union; `widgets/definitions.ts` says how each kind is parsed from the reply and described to the model; `widgets/registry.tsx` maps each kind to its component. Both maps are typed exhaustively, so a new kind that misses a step fails to compile.

## Performance considerations

- **Virtualized `FlatList`**: `initialNumToRender={12}`, `maxToRenderPerBatch={8}`, `windowSize={11}`, and `removeClippedSubviews` on Android.
- **Inverted list**: the newest message sits at offset 0, so auto-scroll to latest needs no `scrollToEnd` timing hacks, and "load older" is a normal `onEndReached`.
- **`maintainVisibleContentPosition`** keeps the reading position steady when a message is deleted or history is prepended.
- **Memoised rows, stable callbacks**: actions are read once from the store, and the screen subscribes with a shallow selector. While a reply streams, only that row re-renders.
- **Animations run on the UI thread** (Reanimated). Only messages created after the screen opened animate in.
- **Images** are resized, compressed JPEGs, about 6 MB in total, most of it the 22 tarot cards.

## Feature checklist

| Brief | Where |
| --- | --- |
| User / AI / Human / System messages | `components/messages/` |
| Virtualized list, auto-scroll, date separators, grouping | `ConversationScreen`, `state/timeline.ts` |
| Multiple horizontal recommendation cards, extensible | `recommendations/` |
| Long-press: Reply, Copy, Delete (Delete only on your own messages) | `MessageMenu` (Retry also offered on failed sends; swipe right to reply) |
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
