import { useState, useRef, useCallback, useEffect } from 'react'

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [currentSpeaker, setCurrentSpeaker] = useState('you')
  const [interimText, setInterimText] = useState('')
  const [error, setError] = useState(null)
  const [isSupported, setIsSupported] = useState(true)
  const [transcriptVersion, setTranscriptVersion] = useState(0)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const recognitionRef = useRef(null)
  const transcriptRef = useRef([])
  const [transcript, setTranscript] = useState([])
  const currentSpeakerRef = useRef('you')
  const shouldRestartRef = useRef(false)
  const lastSpeakerRef = useRef(null)
  const currentEntryIdRef = useRef(null)

  useEffect(() => {
    currentSpeakerRef.current = currentSpeaker
  }, [currentSpeaker])

  const initRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      return null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      let finalText = ''
      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }

      setInterimText(interim)

      if (finalText.trim()) {
        const speaker = currentSpeakerRef.current
        const isSameSpeaker = lastSpeakerRef.current === speaker && currentEntryIdRef.current != null
        const arr = transcriptRef.current

        if (isSameSpeaker && arr.length > 0) {
          const lastIdx = arr.length - 1
          const existing = arr[lastIdx]
          if (existing.id === currentEntryIdRef.current) {
            arr[lastIdx] = {
              ...existing,
              text: existing.text + ' ' + finalText.trim()
            }
            transcriptRef.current = [...arr]
            setTranscript([...transcriptRef.current])
            setTranscriptVersion((v) => v + 1)
            return
          }
        }

        const entryId = Date.now() + Math.random()
        currentEntryIdRef.current = entryId
        lastSpeakerRef.current = speaker

        const newEntry = {
          speaker,
          text: finalText.trim(),
          timestamp: new Date(),
          id: entryId
        }

        transcriptRef.current = [...transcriptRef.current, newEntry]
        setTranscript([...transcriptRef.current])
        setTranscriptVersion((v) => v + 1)
      }
    }

    recognition.onerror = (event) => {
      const fatalErrors = ['not-allowed', 'service-not-allowed']
      if (fatalErrors.includes(event.error)) {
        shouldRestartRef.current = false
        setIsListening(false)
        setPermissionDenied(true)
        setError('Microphone access denied. Click the lock icon in Chrome\'s address bar → Allow microphone → Reload.')
        return
      }
      if (event.error === 'no-speech' || event.error === 'aborted') return
      if (event.error === 'audio-capture') {
        setError('No microphone found. Please connect a microphone.')
        return
      }
      setError(`Speech error: ${event.error}`)
    }

    recognition.onend = () => {
      if (shouldRestartRef.current) {
        setTimeout(() => {
          try {
            recognition.start()
          } catch (e) {
            /* ignore */
          }
        }, 200)
      } else {
        setIsListening(false)
      }
    }

    return recognition
  }, [])

  useEffect(() => {
    const recognition = initRecognition()
    recognitionRef.current = recognition
    return () => {
      shouldRestartRef.current = false
      if (recognition) {
        try { recognition.stop() } catch (e) { /* ignore */ }
      }
    }
  }, [initRecognition])

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) return
    setError(null)
    setPermissionDenied(false)

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (e) {
      setPermissionDenied(true)
      setError('Microphone access denied. Click the lock icon in Chrome\'s address bar → Allow microphone → Reload.')
      return
    }

    shouldRestartRef.current = true
    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch (e) {
      if (e.message?.includes('already started')) {
        setIsListening(true)
      } else {
        const fresh = initRecognition()
        recognitionRef.current = fresh
        if (fresh) {
          try {
            fresh.start()
            setIsListening(true)
          } catch (e2) {
            setError('Failed to start speech recognition.')
            console.error('Failed to start recognition:', e2)
          }
        }
      }
    }
  }, [initRecognition])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    shouldRestartRef.current = false
    try { recognitionRef.current.stop() } catch (e) { /* ignore */ }
    setIsListening(false)
    setInterimText('')
  }, [])

  const setSpeaker = useCallback((speaker) => {
    lastSpeakerRef.current = null
    currentEntryIdRef.current = null
    setCurrentSpeaker(speaker)
  }, [])

  const addTranscriptEntry = useCallback((entry) => {
    const newEntry = { ...entry, id: Date.now() + Math.random() }
    transcriptRef.current = [...transcriptRef.current, newEntry]
    setTranscript([...transcriptRef.current])
    setTranscriptVersion((v) => v + 1)
  }, [])

  const updateOrAddRemoteEntry = useCallback((entry) => {
    const arr = transcriptRef.current
    const sourceId = entry.sourceId

    if (sourceId && arr.length > 0) {
      const lastIdx = arr.length - 1
      const existing = arr[lastIdx]
      if (existing.sourceId === sourceId && existing.speaker === entry.speaker) {
        arr[lastIdx] = { ...existing, text: entry.text }
        transcriptRef.current = [...arr]
        setTranscript([...transcriptRef.current])
        setTranscriptVersion((v) => v + 1)
        return
      }
    }

    const newEntry = {
      speaker: entry.speaker,
      text: entry.text,
      timestamp: new Date(),
      id: Date.now() + Math.random(),
      sourceId: sourceId
    }
    transcriptRef.current = [...transcriptRef.current, newEntry]
    setTranscript([...transcriptRef.current])
    setTranscriptVersion((v) => v + 1)
  }, [])

  const clearTranscript = useCallback(() => {
    transcriptRef.current = []
    setTranscript([])
    setTranscriptVersion(0)
    lastSpeakerRef.current = null
    currentEntryIdRef.current = null
  }, [])

  return {
    transcript,
    transcriptVersion,
    isListening,
    currentSpeaker,
    interimText,
    error,
    isSupported,
    permissionDenied,
    startListening,
    stopListening,
    setSpeaker,
    addTranscriptEntry,
    updateOrAddRemoteEntry,
    clearTranscript
  }
}
