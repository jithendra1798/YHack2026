import { useState, useRef, useCallback, useEffect } from 'react'
import { io } from 'socket.io-client'

function getServerUrl() {
  if (import.meta.env.VITE_SERVER_URL) return import.meta.env.VITE_SERVER_URL
  const { protocol, hostname } = window.location
  // Dev: connect directly to Express server on port 3001 (not through Vite proxy)
  // Prod: same origin (Express serves both API and static files)
  if (import.meta.env.DEV) return `${protocol}//${hostname}:3001`
  return window.location.origin
}

export function useRoom() {
  const [roomCode, setRoomCode] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [peerConnected, setPeerConnected] = useState(false)
  const [bothReady, setBothReady] = useState(false)
  const [role, setRole] = useState(null)
  const [error, setError] = useState(null)
  const [peerLeft, setPeerLeft] = useState(false)

  const socketRef = useRef(null)
  const remoteTranscriptCallbackRef = useRef(null)
  const signalCallbackRef = useRef(null)

  useEffect(() => {
    const url = getServerUrl()
    console.log('Socket.IO connecting to:', url)

    const socket = io(url, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000
    })

    socket.on('connect', () => {
      console.log('Socket.IO connected:', socket.id)
      setIsConnected(true)
      setError(null)
    })

    socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason)
      setIsConnected(false)
    })

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connect error:', err.message)
      setError(`Cannot connect to server at ${url}. Make sure the server is running.`)
    })

    socket.on('peer-joined', () => {
      setPeerConnected(true)
      setPeerLeft(false)
    })

    socket.on('peer-left', () => {
      setPeerConnected(false)
      setPeerLeft(true)
      setBothReady(false)
    })

    socket.on('both-ready', () => {
      setBothReady(true)
    })

    socket.on('remote-transcript', (entry) => {
      if (remoteTranscriptCallbackRef.current) {
        remoteTranscriptCallbackRef.current(entry)
      }
    })

    socket.on('webrtc-signal', (data) => {
      if (signalCallbackRef.current) {
        signalCallbackRef.current(data)
      }
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [])

  const createRoom = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current?.connected) {
        reject(new Error('Not connected to server'))
        return
      }
      socketRef.current.emit('create-room', (response) => {
        if (response.error) {
          setError(response.error)
          reject(new Error(response.error))
        } else {
          setRoomCode(response.code)
          setRole('host')
          setError(null)
          resolve(response.code)
        }
      })
    })
  }, [])

  const joinRoom = useCallback((code) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current?.connected) {
        reject(new Error('Not connected to server'))
        return
      }
      socketRef.current.emit('join-room', code.toUpperCase(), (response) => {
        if (response.error) {
          setError(response.error)
          reject(new Error(response.error))
        } else {
          setRoomCode(code.toUpperCase())
          setRole('guest')
          setPeerConnected(true)
          setError(null)
          resolve()
        }
      })
    })
  }, [])

  const sendTranscriptEntry = useCallback((entry) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('transcript-entry', entry)
    }
  }, [])

  const onRemoteTranscript = useCallback((callback) => {
    remoteTranscriptCallbackRef.current = callback
  }, [])

  const sendSignal = useCallback((data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('webrtc-signal', data)
    }
  }, [])

  const onSignal = useCallback((callback) => {
    signalCallbackRef.current = callback
  }, [])

  const playerReady = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('player-ready')
    }
  }, [])

  const leaveRoom = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current.connect()
    }
    setRoomCode(null)
    setRole(null)
    setPeerConnected(false)
    setBothReady(false)
    setPeerLeft(false)
  }, [])

  return {
    roomCode,
    isConnected,
    peerConnected,
    bothReady,
    role,
    error,
    peerLeft,
    createRoom,
    joinRoom,
    sendTranscriptEntry,
    onRemoteTranscript,
    sendSignal,
    onSignal,
    playerReady,
    leaveRoom
  }
}
