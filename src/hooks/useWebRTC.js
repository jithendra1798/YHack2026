import { useState, useRef, useCallback, useEffect } from 'react'

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' }
]

export function useWebRTC({ sendSignal, onSignal, isInitiator }) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [localStream, setLocalStream] = useState(null)

  const pcRef = useRef(null)
  const remoteAudioRef = useRef(null)
  const localStreamRef = useRef(null)
  const pendingCandidatesRef = useRef([])
  const startedRef = useRef(false)

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({ type: 'ice-candidate', candidate: event.candidate })
      }
    }

    pc.ontrack = (event) => {
      if (!remoteAudioRef.current) {
        const audio = document.createElement('audio')
        audio.autoplay = true
        audio.playsInline = true
        audio.style.display = 'none'
        document.body.appendChild(audio)
        remoteAudioRef.current = audio
      }
      remoteAudioRef.current.srcObject = event.streams[0]
      setIsCallActive(true)
    }

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setIsCallActive(false)
      }
    }

    return pc
  }, [sendSignal])

  const startCall = useCallback(async () => {
    if (startedRef.current) return
    startedRef.current = true

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = stream
      setLocalStream(stream)

      const pc = createPeerConnection()
      pcRef.current = pc

      stream.getTracks().forEach((track) => pc.addTrack(track, stream))

      for (const candidate of pendingCandidatesRef.current) {
        await pc.addIceCandidate(candidate)
      }
      pendingCandidatesRef.current = []

      if (isInitiator) {
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        sendSignal({ type: 'offer', sdp: offer })
      }
    } catch (err) {
      console.error('WebRTC startCall error:', err)
      startedRef.current = false
    }
  }, [isInitiator, createPeerConnection, sendSignal])

  useEffect(() => {
    if (!onSignal) return

    onSignal(async (data) => {
      const pc = pcRef.current

      if (data.type === 'offer') {
        if (!pc) {
          await startCall()
          const currentPc = pcRef.current
          if (!currentPc) return
          await currentPc.setRemoteDescription(new RTCSessionDescription(data.sdp))
          const answer = await currentPc.createAnswer()
          await currentPc.setLocalDescription(answer)
          sendSignal({ type: 'answer', sdp: answer })
        } else {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          sendSignal({ type: 'answer', sdp: answer })
        }
      } else if (data.type === 'answer') {
        if (pc && pc.signalingState !== 'stable') {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
        }
      } else if (data.type === 'ice-candidate') {
        if (pc && pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        } else {
          pendingCandidatesRef.current.push(new RTCIceCandidate(data.candidate))
        }
      }
    })
  }, [onSignal, startCall, sendSignal])

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

  return {
    isCallActive,
    localStream,
    startCall,
    endCall
  }
}
