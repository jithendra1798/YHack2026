import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

app.use(cors())
app.use(express.json())

// Claude API proxy
app.post('/api/claude', async (req, res) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in .env file' })
    }
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    })
    const data = await response.text()
    res.status(response.status).set('Content-Type', 'application/json').send(data)
  } catch (err) {
    console.error('Claude proxy error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Serve built static files in production
const distPath = join(__dirname, 'dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('{*path}', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/socket.io')) {
      res.sendFile(join(distPath, 'index.html'))
    }
  })
}

// Room management
const rooms = new Map()

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`)

  socket.on('create-room', (callback) => {
    let code = generateCode()
    while (rooms.has(code)) code = generateCode()

    rooms.set(code, {
      host: socket.id,
      guest: null,
      hostReady: false,
      guestReady: false
    })
    socket.join(code)
    socket.data.roomCode = code
    socket.data.role = 'host'
    callback({ code })
    console.log(`Room created: ${code} by ${socket.id}`)
  })

  socket.on('join-room', (code, callback) => {
    const room = rooms.get(code)
    if (!room) {
      callback({ error: 'Room not found. Check the code and try again.' })
      return
    }
    if (room.guest) {
      callback({ error: 'Room is full.' })
      return
    }
    room.guest = socket.id
    socket.join(code)
    socket.data.roomCode = code
    socket.data.role = 'guest'
    callback({ success: true })

    io.to(code).emit('peer-joined', { hostId: room.host, guestId: room.guest })
    console.log(`${socket.id} joined room ${code}`)
  })

  socket.on('player-ready', () => {
    const code = socket.data.roomCode
    const room = rooms.get(code)
    if (!room) return

    if (socket.data.role === 'host') room.hostReady = true
    else room.guestReady = true

    if (room.hostReady && room.guestReady) {
      io.to(code).emit('both-ready')
    }
  })

  socket.on('transcript-entry', (entry) => {
    const code = socket.data.roomCode
    if (!code) return
    socket.to(code).emit('remote-transcript', {
      ...entry,
      speaker: 'them'
    })
  })

  socket.on('webrtc-signal', (data) => {
    const code = socket.data.roomCode
    if (!code) return
    socket.to(code).emit('webrtc-signal', data)
  })

  socket.on('end-session', () => {
    const code = socket.data.roomCode
    if (!code) return
    socket.to(code).emit('peer-ended')
    console.log(`${socket.id} ended session in room ${code}`)
  })

  socket.on('disconnect', () => {
    const code = socket.data.roomCode
    if (code) {
      const room = rooms.get(code)
      if (room) {
        socket.to(code).emit('peer-left')
        if (room.host === socket.id) room.host = null
        if (room.guest === socket.id) room.guest = null
        if (!room.host && !room.guest) {
          rooms.delete(code)
          console.log(`Room ${code} deleted`)
        }
      }
    }
    console.log(`Disconnected: ${socket.id}`)
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, '0.0.0.0', () => {
  console.log(`PARLEY server running on port ${PORT}`)
  import('os').then(({ networkInterfaces }) => {
    const nets = networkInterfaces()
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`  Network: http://${net.address}:${PORT}`)
        }
      }
    }
  }).catch(() => {})
})
