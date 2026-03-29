# PARLEY — Project Context

## What This Is

PARLEY is a real-time AI negotiation copilot built for YHack 2026. It listens to live negotiations and provides tactical intelligence: detecting manipulation tactics, suggesting counter-arguments, and showing a live power shift meter.

## Architecture

Single-page React app + Node.js server. No database.

```
Browser (React + Vite)          Server (Express + Socket.IO)
├── Web Speech API (STT)        ├── Claude API proxy (/api/claude)
├── WebRTC (peer audio)    <--> ├── Socket.IO (rooms, signaling, transcript relay)
├── Claude analysis hook        └── Static file server (production)
└── Framer Motion UI
```

## Three Modes

1. **Live** — Solo mode. User speaks into mic, toggles You/Them speaker, Claude analyzes.
2. **Demo** — Auto-plays a scripted rent negotiation with SpeechSynthesis, Claude analyzes each line.
3. **Versus** — Two players connect via room code. Each gets their own AI agent. WebRTC carries audio between browsers. Each player's speech is transcribed locally and relayed via Socket.IO.

## Running Locally

```bash
npm run dev    # Runs both: concurrently "vite --host" "node server.js"
```

- Vite: port 5173 (frontend)
- Express: port 3001 (API proxy + Socket.IO + static files in production)
- In dev, the client connects Socket.IO and API calls directly to port 3001
- In production, everything runs on one port from server.js serving the built `dist/`

## Key Files

### Server
- `server.js` — Express + Socket.IO. Handles `/api/claude` proxy, room management (create/join/ready), WebRTC signaling relay, transcript relay, end-session events. Binds to 0.0.0.0 for LAN access.

### Hooks
- `src/hooks/useSpeechRecognition.js` — Web Speech API wrapper. Handles continuous recognition, speaker labeling, auto-restart, mic permissions. Appends text to same transcript entry when same speaker continues (uses stable `id`). Exposes `updateOrAddRemoteEntry()` for versus mode to avoid duplicate entries.
- `src/hooks/useClaudeAnalysis.js` — Debounced Claude API calls triggered by `transcriptVersion` changes. Parses JSON response, handles retries. Uses refs to avoid stale closures.
- `src/hooks/useDemoMode.js` — Plays `DEMO_SCRIPT` using SpeechSynthesis API with two voices. Triggers Claude analysis after each line.
- `src/hooks/useRoom.js` — Socket.IO client. Room create/join, transcript relay, WebRTC signaling, player-ready sync, end-session. Connects to `hostname:3001` in dev, same origin in prod.
- `src/hooks/useWebRTC.js` — RTCPeerConnection with STUN servers. Host creates offer, guest answers. Audio streams via hidden `<audio>` element. Uses refs for `sendSignal` to avoid stale closures in signal handler. Uses `pcReadyPromise` to prevent race condition where signals arrive before PC is created (see fix below).

### Components
- `App.jsx` — Routes between setup → room → session screens. Owns the `useRoom` hook instance.
- `SetupScreen.jsx` — Briefing form with quick-load scenarios. Three buttons: Live, Demo, Two Player.
- `RoomScreen.jsx` — Room lobby. Create/join room, pre-filled context forms (host=negotiator, guest=counterparty), auto-starts when both ready.
- `SessionScreen.jsx` — Main screen. Wires together speech recognition, Claude analysis, WebRTC, room transcript relay. Has mute, hide transcript, end conversation, AI on/off toggles.
- `Header.jsx` — Mode indicator, room code, agent toggle, mute button, hide transcript, end button.
- `Transcript.jsx` — Rolling transcript with speaker dots, timestamps, interim text.
- `TacticAlertFeed.jsx` + `TacticAlert.jsx` — Detected tactics stack with severity colors.
- `CounterMovePanel.jsx` — Counter-move suggestions with tone badges.
- `PowerMeter.jsx` — Horizontal bar with animated marker showing leverage.
- `DemoMode.jsx` — Floating play/pause/stop controls for demo playback.

### Lib
- `src/lib/prompts.js` — Claude system prompt (enforces short responses: max 15-word suggestions, max 8-word reasoning) and analysis prompt template.
- `src/lib/demoScript.js` — Pre-written rent negotiation script with short natural sentences.
- `src/lib/tactics.js` — Tactic metadata (name, icon, color, description) for 13 negotiation tactics.

### Config
- `vite.config.js` — React + Tailwind plugins. Proxies `/api` and `/socket.io` to localhost:3001 (dev only).
- `server.js` — Binds 0.0.0.0, logs network IP. Serves `dist/` in production.
- `.env` — `ANTHROPIC_API_KEY` (not committed)
- `railway.json` — Railway deployment config.

## Common Issues

- **"Empty response from server"** — Server (port 3001) not running. Must use `npm run dev` not just `vite`.
- **401 from Claude** — Bad API key in `.env`.
- **Mic not working** — Must use Chrome. Must allow mic permission.
- **LAN connection fails** — University/conference WiFi often blocks device-to-device traffic (AP isolation). Use phone hotspot or deploy to Railway.
- **Audio not playing in versus** — Fixed: Race condition where host's offer arrived at guest while guest's `startCall()` was still awaiting `getUserMedia`. Signal handler saw `startedRef=true` but `pcRef=null` and silently dropped the offer. Fix: added `pcReadyPromise` so signal handler waits for PC to be fully created before processing. Also added fallback for empty `e.streams` in `ontrack`, audio play retry on ICE connect, and `touchstart` listener for mobile autoplay.
- **Transcript duplicates on remote** — Fixed: remote entries use `sourceId` matching via `updateOrAddRemoteEntry()`.

## Design

Dark tactical UI. Background: `#06060b`, cyan accent: `#00f0ff`, red accent: `#ff3b5c`, green: `#00ff88`. JetBrains Mono for transcript, Inter for UI. Glassmorphism cards, animated grid background, scan line effect.
