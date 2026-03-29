import { useState, useRef, useCallback, useEffect } from 'react'

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' }
]

export function useWebRTC({ sendSignal, onSignal, isInitiator }) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [localStream, setLocalStream] = useState(null)

  const pcRef = useRef(null)
  const remoteAudioRef = useRef(null)
  const localStreamRef = useRef(null)
  const pendingCandidatesRef = useRef([])
  const startedRef = useRef(false)
  const sendSignalRef = useRef(sendSignal)
  const isInitiatorRef = useRef(isInitiator)

  useEffect(() => { sendSignalRef.current = sendSignal }, [sendSignal])
  useEffect(() => { isInitiatorRef.current = isInitiator }, [isInitiator])

  const getOrCreateAudio = useCallback(() => {
    if (!remoteAudioRef.current) {
      const audio = new Audio()
      audio.autoplay = true
      audio.playsInline = true
      audio.volume = 1.0
      document.body.appendChild(audio)
      remoteAudioRef.current = audio
    }
    return remoteAudioRef.current
  }, [])

  const createPC = useCallback(() => {
    if (pcRef.current) {
      try { pcRef.current.close() } catch (e) { /* ignore */ }
    }

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })

    pc.onicecandidate = (e) => {
      if (e.candidate) sendSignalRef.current({ type: 'ice-candidate', candidate: e.candidate })
    }

    pc.ontrack = (e) => {
      console.log('WebRTC: remote audio track received')
      const audio = getOrCreateAudio()
      audio.srcObject = e.streams[0]
      audio.play().then(() => {
        console.log('WebRTC: audio playing')
      }).catch(() => {
        console.warn('WebRTC: autoplay blocked, retrying on click')
        const resume = () => {
          audio.play().catch(() => {})
          document.removeEventListener('click', resume)
        }
        document.addEventListener('click', resume)
      })
      setIsCallActive(true)
    }

    pc.oniceconnectionstatechange = () => {
      const state = pc.iceConnectionState
      console.log('WebRTC ICE:', state)
      if (state === 'connected' || state === 'completed') setIsCallActive(true)
      if (state === 'disconnected' || state === 'failed') setIsCallActive(false)
    }

    pcRef.current = pc
    return pc
  }, [getOrCreateAudio])

  const startCall = useCallback(async () => {
    if (startedRef.current) return
    startedRef.current = true

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = stream
      setLocalStream(stream)

      const pc = createPC()
      stream.getTracks().forEach((track) => pc.addTrack(track, stream))

      for (const c of pendingCandidatesRef.current) {
        try { await pc.addIceCandidate(c) } catch (e) { /* ignore */ }
      }
      pendingCandidatesRef.current = []

      if (isInitiatorRef.current) {
        const offer = await pc.createOffer({ offerToReceiveAudio: true })
        await pc.setLocalDescription(offer)
        sendSignalRef.current({ type: 'offer', sdp: offer })
        console.log('WebRTC: offer sent')
      } else {
        console.log('WebRTC: waiting for offer')
      }
    } catch (err) {
      console.error('WebRTC startCall error:', err)
      startedRef.current = false
    }
  }, [createPC])

  // Handle incoming WebRTC signals — uses refs to avoid stale closures
  useEffect(() => {
    if (!onSignal) return

    onSignal(async (data) => {
      try {
        if (data.type === 'offer') {
          console.log('WebRTC: received offer')
          if (!startedRef.current) {
            startedRef.current = true
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            localStreamRef.current = stream
            setLocalStream(stream)
            const pc = createPC()
            stream.getTracks().forEach((track) => pc.addTrack(track, stream))
          }
          const pc = pcRef.current
          if (!pc) return
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          sendSignalRef.current({ type: 'answer', sdp: answer })
          console.log('WebRTC: answer sent')

          for (const c of pendingCandidatesRef.current) {
            try { await pc.addIceCandidate(c) } catch (e) { /* ignore */ }
          }
          pendingCandidatesRef.current = []
        } else if (data.type === 'answer') {
          console.log('WebRTC: received answer')
          const pc = pcRef.current
          if (pc && pc.signalingState !== 'stable') {
            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
          }
        } else if (data.type === 'ice-candidate') {
          const pc = pcRef.current
          if (pc && pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
          } else {
            pendingCandidatesRef.current.push(new RTCIceCandidate(data.candidate))
          }
        }
      } catch (err) {
        console.error('WebRTC signal error:', err)
      }
    })
  }, [onSignal, createPC])

  const endCall = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close()
      pcRef.current = null
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop())
      localStreamRef.current = null
      setLocalStream(null)
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null
      remoteAudioRef.current.remove()
      remoteAudioRef.current = null
    }
    setIsCallActive(false)
    startedRef.current = false
  }, [])

  useEffect(() => {
    return () => endCall()
  }, [endCall])

  return { isCallActive, localStream, startCall, endCall }
}
