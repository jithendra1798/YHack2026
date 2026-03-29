# PARLEY — AI Negotiation Copilot

**Real-time negotiation intelligence that shifts the power to you.**

PARLEY listens to your live negotiation and provides real-time tactical intelligence: detecting manipulation tactics, suggesting specific counter-arguments, and visualizing who has leverage with a live Power Shift Meter.

## Features

- **Live Transcript** — Real-time speech-to-text with speaker labels
- **Tactic Detection** — Flags manipulation tactics (anchoring, false urgency, guilt-tripping, etc.)
- **Counter Moves** — Specific phrases and strategies to say next
- **Power Shift Meter** — Live visualization of who has leverage
- **Two-Player Mode** — Two people connect via room code, each gets their own AI agent
- **Agent Toggle** — Disable/enable AI suggestions per user
- **Demo Mode** — Auto-playing rent negotiation with text-to-speech

## Tech Stack

- React (Vite) + Tailwind CSS + Framer Motion
- Web Speech API (browser-native speech recognition)
- Anthropic Claude API (claude-sonnet-4-20250514)
- Socket.IO (real-time room management)
- WebRTC (peer-to-peer audio for two-player mode)
- Express.js (API proxy + signaling server)

## Prerequisites

- **Node.js** 18+
- **Google Chrome** (required for Web Speech API)
- **Anthropic API key** — get one at https://console.anthropic.com/

---

## Quick Start

```bash
# Clone
git clone https://github.com/jithendra1798/YHack2026.git
cd YHack2026

# Install
npm install

# Configure — add your Anthropic API key
cp .env.example .env
# Edit .env: ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# Run
npm run dev
```

Open **http://localhost:5173** in Chrome. You should see both lines in terminal:

```
[1] PARLEY server running on port 3001
[0] VITE v8.0.3 ready
[0] ➜  Local:   http://localhost:5173/
[0] ➜  Network: http://192.168.x.x:5173/
```

---

## Two-Player Mode: Same Network (LAN)

Both laptops must be on the **same Wi-Fi / Ethernet network**. Only the host laptop needs Node.js and the code installed.

### Host Laptop (runs the server)

```bash
cd YHack2026
npm run dev
```

Note the **Network URL** in the terminal output (e.g., `http://192.168.1.42:5173/`).

Open Chrome → go to `http://localhost:5173`

### Second Laptop (just needs Chrome)

No installation needed. Open Chrome and go to the **Network URL** from the host terminal:

```
http://192.168.1.42:5173
```

> Replace `192.168.1.42` with whatever IP the host terminal shows.

### Connecting

1. **Laptop A** → "Two Player" → "Create Room" → gets a code like `KX3P7N`
2. **Laptop B** → "Two Player" → enters the code → "Join"
3. Both fill in their private briefing → both click "Ready to Negotiate"
4. When both ready, click "Start Negotiation"
5. Both hear each other through browser audio (WebRTC)
6. Each player gets their own independent AI agent
7. Use the **AI On/Off** toggle in the header to disable suggestions

### Troubleshooting LAN Connection

| Problem | Fix |
|---------|-----|
| "Cannot connect to server" | Make sure both laptops are on the same Wi-Fi network |
| Page loads but Socket.IO fails | Check that host firewall allows port 3001 (macOS: System Settings → Firewall → allow Node.js) |
| Room code doesn't work | Make sure you're using the code exactly as shown (6 uppercase characters) |
| No audio between players | Allow microphone permission in Chrome when prompted |

---

## Two-Player Mode: Deployed Server

When deployed to a cloud platform, both players just open the URL in Chrome. No LAN needed.

### Deploy to Railway / Render / Fly.io

```bash
# Build the frontend
npm run build

# The server.js automatically serves the built files from dist/
# Deploy the entire project — set these environment variables:
#   ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
#   PORT=3001 (or whatever the platform assigns)
#   NODE_ENV=production

# Start command: node server.js
```

Both players open `https://your-app.railway.app` in Chrome and use Two-Player mode normally.

### Deploy to Vercel

Vercel doesn't support WebSocket (Socket.IO), so two-player mode won't work there. Use Railway, Render, or Fly.io instead. Solo mode and demo mode work on Vercel using the `api/claude.js` serverless function.

---

## All Modes

### Solo Mode (Live)
1. Fill in the briefing form (or click a Quick Load scenario)
2. Click **"Live Session"**
3. Allow microphone access in Chrome
4. Toggle between **You** / **Them** speaker buttons as conversation flows
5. PARLEY analyzes each exchange in real-time

### Demo Mode
1. Click **"Run Demo"** — no setup needed
2. Watches a rent negotiation play out with text-to-speech
3. Tactic alerts, counter-moves, and power meter all animate live

### Two-Player Mode
See the LAN and Deployed sections above.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite + server (both needed) |
| `npm run dev:client` | Vite frontend only |
| `npm run server` | Node.js server only |
| `npm run build` | Build frontend for production |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `PORT` | No | Server port (default: 3001) |
| `VITE_SERVER_URL` | No | Override Socket.IO server URL |

## Project Structure

```
├── server.js                      # Express + Socket.IO + static file server
├── src/
│   ├── App.jsx                    # Main app routing
│   ├── components/
│   │   ├── SetupScreen.jsx        # Pre-call briefing + mode selection
│   │   ├── RoomScreen.jsx         # Two-player room lobby
│   │   ├── SessionScreen.jsx      # Main negotiation screen
│   │   ├── Transcript.jsx         # Live transcript panel
│   │   ├── TacticAlertFeed.jsx    # Detected tactics stack
│   │   ├── CounterMovePanel.jsx   # AI-suggested responses
│   │   ├── PowerMeter.jsx         # Leverage visualization
│   │   ├── Header.jsx             # Logo, mode, agent toggle
│   │   └── DemoMode.jsx           # Demo playback controls
│   ├── hooks/
│   │   ├── useSpeechRecognition.js
│   │   ├── useClaudeAnalysis.js
│   │   ├── useDemoMode.js
│   │   ├── useRoom.js             # Socket.IO room management
│   │   └── useWebRTC.js           # Peer-to-peer audio
│   └── lib/
│       ├── prompts.js             # Claude system prompts
│       ├── demoScript.js          # Demo negotiation script
│       └── tactics.js             # Tactic metadata
└── api/
    └── claude.js                  # Vercel serverless proxy (solo mode only)
```
