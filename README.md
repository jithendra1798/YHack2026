# PARLEY — AI Negotiation Copilot

**Real-time negotiation intelligence that shifts the power to you.**

PARLEY listens to your live negotiation and provides real-time tactical intelligence: detecting manipulation tactics, suggesting specific counter-arguments, and visualizing who has leverage with a live Power Shift Meter.

## Features

- **Live Transcript** — Real-time speech-to-text with speaker labels
- **Tactic Detection** — Flags manipulation tactics as they happen (anchoring, false urgency, guilt-tripping, etc.)
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

- **Node.js** 18+ installed
- **Google Chrome** (required for Web Speech API)
- **Anthropic API key** — get one at https://console.anthropic.com/

## Setup & Installation

```bash
# 1. Clone the repo
git clone https://github.com/jithendra1798/YHack2026.git
cd YHack2026

# 2. Install dependencies
npm install

# 3. Create your .env file with your API key
cp .env.example .env
# Edit .env and add your Anthropic API key:
# ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx

# 4. Start the app (runs both Vite client + Node.js server)
npm run dev
```

Open **http://localhost:5173** in **Google Chrome**.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both Vite dev server + Node.js backend |
| `npm run dev:client` | Start only the Vite frontend |
| `npm run server` | Start only the Node.js backend |
| `npm run build` | Build for production |

## How to Use

### Solo Mode (Live)
1. Fill in the briefing form (or click a Quick Load scenario)
2. Click **"Live Session"**
3. Allow microphone access when Chrome prompts
4. Toggle between **You** and **Them** speaker buttons as the conversation flows
5. PARLEY analyzes every exchange and provides real-time coaching

### Demo Mode
1. Click **"Run Demo"** — no setup needed
2. Watches a pre-scripted rent negotiation play out with text-to-speech
3. Claude analyzes each exchange live — tactic alerts, counter-moves, and power meter all animate

### Two-Player Mode
1. Click **"Two Player"**
2. **Player A** clicks "Create Room" — gets a 6-character code
3. **Player B** enters the code and clicks "Join"
4. Both fill in their private briefing (only they see their goals/strategy)
5. Both click "Ready" → negotiation begins
6. Both hear each other through browser audio (WebRTC)
7. Each player gets their own independent AI agent
8. Use the **AI On/Off** toggle in the header to disable suggestions

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `PORT` | No | Server port (default: 3001) |
| `VITE_SERVER_URL` | No | Custom server URL for the client |

## Project Structure

```
├── server.js                      # Express + Socket.IO server
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
    └── claude.js                  # Vercel serverless proxy
```
