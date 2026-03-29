import { useState, useRef, useCallback, useEffect } from 'react'
import { DEMO_SCRIPT } from '../lib/demoScript'

export function useDemoMode({ addTranscriptEntry, injectAnalysis }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLine, setCurrentLine] = useState(-1)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [narratorMessage, setNarratorMessage] = useState(null)

  const voicesRef = useRef([])
  const youVoiceRef = useRef(null)
  const themVoiceRef = useRef(null)
  const cancelledRef = useRef(false)
  const pausedRef = useRef(false)

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      voicesRef.current = voices

      const englishVoices = voices.filter((v) => v.lang.startsWith('en'))

      const maleVoice = englishVoices.find(
        (v) => v.name.includes('Male') || v.name.includes('Daniel') || v.name.includes('James')
      )
      const femaleVoice = englishVoices.find(
        (v) => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Karen')
      )

      youVoiceRef.current = maleVoice || englishVoices[0] || voices[0]
      themVoiceRef.current = femaleVoice || englishVoices[1] || voices[1] || voices[0]
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const speak = useCallback((text, speaker) => {
    return new Promise((resolve) => {
      if (cancelledRef.current) {
        resolve()
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      if (speaker === 'narrator') {
        utterance.voice = youVoiceRef.current
        utterance.rate = 1.0
        utterance.pitch = 1.05
      } else {
        utterance.voice = speaker === 'you' ? youVoiceRef.current : themVoiceRef.current
        utterance.rate = 1.05
        utterance.pitch = speaker === 'you' ? 1.0 : 0.85
      }
      utterance.volume = 1.0

      utterance.onend = () => resolve()
      utterance.onerror = () => resolve()

      window.speechSynthesis.speak(utterance)
    })
  }, [])

  const wait = useCallback((ms) => {
    return new Promise((resolve) => {
      const checkPause = () => {
        if (cancelledRef.current) {
          resolve()
          return
        }
        if (pausedRef.current) {
          setTimeout(checkPause, 200)
          return
        }
        setTimeout(resolve, ms)
      }
      checkPause()
    })
  }, [])

  const startDemo = useCallback(async () => {
    cancelledRef.current = false
    pausedRef.current = false
    setIsPlaying(true)
    setIsComplete(false)
    setCurrentLine(-1)
    setNarratorMessage(null)

    for (let i = 0; i < DEMO_SCRIPT.length; i++) {
      if (cancelledRef.current) break

      while (pausedRef.current && !cancelledRef.current) {
        await new Promise((r) => setTimeout(r, 200))
      }
      if (cancelledRef.current) break

      const line = DEMO_SCRIPT[i]
      setCurrentLine(i)

      // Pause before this line
      await wait(line.delay)
      if (cancelledRef.current) break

      if (line.speaker === 'narrator') {
        // ── NARRATOR: show cloud popup, speak, then hide cloud ──
        setNarratorMessage(line.text)
        await speak(line.speakText || line.text, 'narrator')
        if (cancelledRef.current) break
        // Brief hold so text is readable
        await wait(400)
        setNarratorMessage(null)
        await wait(200)
      } else {
        // ── CONVERSATION: add to transcript, speak, inject analysis ──
        addTranscriptEntry({
          speaker: line.speaker,
          text: line.text,
          timestamp: new Date()
        })

        // Inject pre-seeded analysis ~1s after line appears (simulates AI processing)
        if (line.inject && injectAnalysis) {
          setTimeout(() => {
            if (!cancelledRef.current) {
              injectAnalysis(line.inject)
            }
          }, 1000)
        }

        // Speak the line
        await speak(line.text, line.speaker)
        if (cancelledRef.current) break

        // Natural gap between conversation lines
        await wait(300)
      }
    }

    if (!cancelledRef.current) {
      setIsComplete(true)
    }
    setNarratorMessage(null)
    setIsPlaying(false)
  }, [addTranscriptEntry, injectAnalysis, speak, wait])

  const pauseDemo = useCallback(() => {
    pausedRef.current = true
    setIsPaused(true)
    window.speechSynthesis.pause()
  }, [])

  const resumeDemo = useCallback(() => {
    pausedRef.current = false
    setIsPaused(false)
    window.speechSynthesis.resume()
  }, [])

  const stopDemo = useCallback(() => {
    cancelledRef.current = true
    pausedRef.current = false
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentLine(-1)
    setNarratorMessage(null)
  }, [])

  return {
    isPlaying,
    isPaused,
    isComplete,
    currentLine,
    narratorMessage,
    startDemo,
    pauseDemo,
    resumeDemo,
    stopDemo
  }
}
