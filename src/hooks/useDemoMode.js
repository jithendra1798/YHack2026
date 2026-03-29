import { useState, useRef, useCallback, useEffect } from 'react'
import { DEMO_SCRIPT } from '../lib/demoScript'

export function useDemoMode({ addTranscriptEntry, triggerAnalysis }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLine, setCurrentLine] = useState(-1)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

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
      utterance.voice = speaker === 'you' ? youVoiceRef.current : themVoiceRef.current
      utterance.rate = 0.95
      utterance.pitch = speaker === 'you' ? 1.0 : 0.85
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

    for (let i = 0; i < DEMO_SCRIPT.length; i++) {
      if (cancelledRef.current) break

      while (pausedRef.current && !cancelledRef.current) {
        await new Promise((r) => setTimeout(r, 200))
      }
      if (cancelledRef.current) break

      const line = DEMO_SCRIPT[i]
      setCurrentLine(i)

      await wait(line.delay)
      if (cancelledRef.current) break

      addTranscriptEntry({
        speaker: line.speaker,
        text: line.text,
        timestamp: new Date()
      })

      await speak(line.text, line.speaker)
      if (cancelledRef.current) break

      await wait(1000)
      if (cancelledRef.current) break

      await triggerAnalysis()

      await wait(2000)
    }

    if (!cancelledRef.current) {
      setIsComplete(true)
    }
    setIsPlaying(false)
  }, [addTranscriptEntry, triggerAnalysis, speak, wait])

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
  }, [])

  return {
    isPlaying,
    isPaused,
    isComplete,
    currentLine,
    startDemo,
    pauseDemo,
    resumeDemo,
    stopDemo
  }
}
