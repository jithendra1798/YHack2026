import { useState, useRef, useCallback, useEffect } from 'react'
import { io } from 'socket.io-client'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : window.location.origin
)

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
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    })

    socket.on('connect', () => {
      setIsConnected(true)
      setError(null)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('connect_error', () => {
      setError('Cannot connect to server. Make sure the server is running.')
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
      if (!socketRef.current) {
        reject(new Error('Not connected'))
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
      if (!socketRef.current) {
        reject(new Error('Not connected'))
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
    if (socketRef.current) {
      socketRef.current.emit('transcript-entry', entry)
    }
  }, [])

  const onRemoteTranscript = useCallback((callback) => {
    remoteTranscriptCallbackRef.current = callback
  }, [])

  const sendSignal = useCallback((data) => {
    if (socketRef.current) {
      socketRef.current.emit('webrtc-signal', data)
    }
  }, [])

  const onSignal = useCallback((callback) => {
    signalCallbackRef.current = callback
  }, [])

  const playerReady = useCallback(() => {
    if (socketRef.current) {
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
