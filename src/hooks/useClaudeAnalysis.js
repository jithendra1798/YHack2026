import { useState, useRef, useCallback, useEffect } from 'react'
import { NEGOTIATION_ANALYST_PROMPT, buildAnalysisPrompt } from '../lib/prompts'

function getApiUrl() {
  const { protocol, hostname } = window.location
  if (import.meta.env.DEV) return `${protocol}//${hostname}:3001/api/claude`
  return '/api/claude'
}

export function useClaudeAnalysis(transcript, context, transcriptVersion) {
  const [tactics, setTactics] = useState([])
  const [counterMoves, setCounterMoves] = useState([])
  const [powerScore, setPowerScore] = useState(50)
  const [powerReasoning, setPowerReasoning] = useState('')
  const [situationRead, setSituationRead] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)

  const lastCallTimeRef = useRef(0)
  const debounceTimerRef = useRef(null)
  const lastVersionRef = useRef(0)
  const allTacticsRef = useRef([])
  const retryCountRef = useRef(0)
  const transcriptRef = useRef(transcript)
  const contextRef = useRef(context)

  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

  useEffect(() => {
    contextRef.current = context
  }, [context])

  const analyzeTranscript = useCallback(async () => {
    const currentTranscript = transcriptRef.current
    const currentContext = contextRef.current

    if (!currentTranscript?.length || !currentContext) return

    const now = Date.now()
    const timeSinceLastCall = now - lastCallTimeRef.current
    if (timeSinceLastCall < 3000) {
      setTimeout(() => analyzeTranscript(), 3000 - timeSinceLastCall + 100)
      return
    }

    lastCallTimeRef.current = now
    setIsAnalyzing(true)
    setError(null)

    try {
      const requestBody = {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: NEGOTIATION_ANALYST_PROMPT,
        messages: [
          {
            role: 'user',
            content: buildAnalysisPrompt(currentContext, currentTranscript)
          }
        ]
      }

      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const rawText = await response.text()
      if (!rawText || !rawText.trim()) {
        throw new Error('Empty response from server. Is the server running? Run: npm run dev')
      }

      let data
      try {
        data = JSON.parse(rawText)
      } catch {
        throw new Error('Server returned invalid JSON. Check server logs.')
      }

      if (!response.ok) {
        const errMsg = data.error?.message || data.error || `HTTP ${response.status}`
        throw new Error(errMsg)
      }

      retryCountRef.current = 0

      let text = data.content?.map((c) => c.text || '').join('') || ''
      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

      let parsed
      try {
        parsed = JSON.parse(text)
      } catch {
        throw new Error('Claude returned invalid JSON. Retrying...')
      }

      if (parsed.tactics_detected?.length) {
        const newTactics = parsed.tactics_detected.map((t) => ({
          ...t,
          id: Date.now() + Math.random(),
          timestamp: new Date()
        }))
        allTacticsRef.current = [...newTactics, ...allTacticsRef.current]
        setTactics([...allTacticsRef.current])
      }

      if (parsed.counter_moves?.length) {
        setCounterMoves(parsed.counter_moves)
      }

      if (typeof parsed.power_score === 'number') {
        setPowerScore(Math.max(0, Math.min(100, parsed.power_score)))
      }

      if (parsed.power_reasoning) {
        setPowerReasoning(parsed.power_reasoning)
      }

      if (parsed.situation_read) {
        setSituationRead(parsed.situation_read)
      }
    } catch (err) {
      console.error('Claude analysis error:', err)
      setError(err.message)

      if (retryCountRef.current < 2) {
        retryCountRef.current++
        lastCallTimeRef.current = 0
        setTimeout(() => analyzeTranscript(), 2000)
      }
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  useEffect(() => {
    if (transcriptVersion === lastVersionRef.current) return
    if (transcriptVersion === 0) return
    if (!transcript.length) return

    lastVersionRef.current = transcriptVersion

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      analyzeTranscript()
    }, 2500)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [transcriptVersion, transcript, analyzeTranscript])

  const triggerAnalysis = useCallback(() => {
    lastCallTimeRef.current = 0
    retryCountRef.current = 0
    return analyzeTranscript()
  }, [analyzeTranscript])

  const reset = useCallback(() => {
    setTactics([])
    setCounterMoves([])
    setPowerScore(50)
    setPowerReasoning('')
    setSituationRead('')
    setError(null)
    allTacticsRef.current = []
    lastVersionRef.current = 0
    retryCountRef.current = 0
  }, [])

  return {
    tactics,
    counterMoves,
    powerScore,
    powerReasoning,
    situationRead,
    isAnalyzing,
    error,
    triggerAnalysis,
    reset
  }
}
