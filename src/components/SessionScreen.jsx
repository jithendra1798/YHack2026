import { useEffect, useState, useCallback } from 'react'
import Header from './Header'
import Transcript from './Transcript'
import TacticAlertFeed from './TacticAlertFeed'
import CounterMovePanel from './CounterMovePanel'
import PowerMeter from './PowerMeter'
import DemoMode from './DemoMode'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useClaudeAnalysis } from '../hooks/useClaudeAnalysis'
import { useDemoMode } from '../hooks/useDemoMode'
import { useWebRTC } from '../hooks/useWebRTC'

export default function SessionScreen({ context, mode, room, onBack }) {
  const [agentEnabled, setAgentEnabled] = useState(true)

  const {
    transcript,
    transcriptVersion,
    isListening,
    currentSpeaker,
    interimText,
    error: micError,
    isSupported,
    permissionDenied,
    startListening,
    stopListening,
    setSpeaker,
    addTranscriptEntry,
    clearTranscript
  } = useSpeechRecognition()

  const {
    tactics,
    counterMoves,
    powerScore,
    powerReasoning,
    situationRead,
    isAnalyzing,
    error: analysisError,
    triggerAnalysis,
    reset: resetAnalysis
  } = useClaudeAnalysis(transcript, context, transcriptVersion)

  const demoMode = useDemoMode({ addTranscriptEntry, triggerAnalysis })

  const isVersus = mode === 'versus'
  const webrtc = useWebRTC({
    sendSignal: isVersus ? room?.sendSignal : () => {},
    onSignal: isVersus ? room?.onSignal : () => {},
    isInitiator: isVersus && room?.role === 'host'
  })

  // Live mode: start mic
  useEffect(() => {
    if (mode === 'live' && isSupported) {
      startListening()
      return () => stopListening()
    }
  }, [mode, isSupported, startListening, stopListening])

  // Demo mode: auto-play
  useEffect(() => {
    if (mode === 'demo') {
      clearTranscript()
      resetAnalysis()
      const timer = setTimeout(() => {
        demoMode.startDemo()
      }, 1000)
      return () => {
        clearTimeout(timer)
        demoMode.stopDemo()
      }
    }
  }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Versus mode: start WebRTC call + mic + listen for remote transcript
  useEffect(() => {
    if (!isVersus || !room) return

    webrtc.startCall()
    startListening()

    room.onRemoteTranscript((entry) => {
      addTranscriptEntry(entry)
    })

    return () => {
      stopListening()
      webrtc.endCall()
    }
  }, [isVersus]) // eslint-disable-line react-hooks/exhaustive-deps

  // Versus mode: send local transcript entries to peer
  const originalAddTranscriptEntry = addTranscriptEntry
  const versusAwareAddEntry = useCallback((entry) => {
    originalAddTranscriptEntry(entry)
    if (isVersus && room && entry.speaker === 'you') {
      room.sendTranscriptEntry(entry)
    }
  }, [isVersus, room, originalAddTranscriptEntry])

  // In versus mode, override the speech recognition to always label as "you" and send to peer
  useEffect(() => {
    if (!isVersus) return
    // Keep speaker as "you" in versus mode — no toggle needed
    setSpeaker('you')
  }, [isVersus, setSpeaker])

  // Send transcript entries from speech recognition to the room
  useEffect(() => {
    if (!isVersus || !room) return
    if (transcript.length === 0) return
    const lastEntry = transcript[transcript.length - 1]
    if (lastEntry.speaker === 'you') {
      room.sendTranscriptEntry(lastEntry)
    }
  }, [transcriptVersion]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleBack = () => {
    stopListening()
    demoMode.stopDemo()
    if (isVersus) {
      webrtc.endCall()
    }
    clearTranscript()
    resetAnalysis()
    onBack()
  }

  const handleRetryMic = () => {
    startListening()
  }

  return (
    <div className="h-screen flex flex-col bg-[#06060b] overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.5]" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute inset-0 scanline" />

      <div className="relative z-10 flex flex-col h-full">
        <Header
          mode={mode}
          isListening={isListening}
          onBack={handleBack}
          roomCode={isVersus ? room?.roomCode : null}
          peerConnected={isVersus ? room?.peerConnected : false}
          agentEnabled={agentEnabled}
          onToggleAgent={() => setAgentEnabled((v) => !v)}
        />

        {!isSupported && (mode === 'live' || mode === 'versus') && (
          <div className="px-6 py-2.5 bg-[#ff6b35]/[0.08] border-b border-[#ff6b35]/20">
            <p className="text-[#ff6b35] text-[12px] text-center font-medium">
              Speech recognition requires Google Chrome. Demo mode works in any browser.
            </p>
          </div>
        )}

        {micError && (mode === 'live' || mode === 'versus') && (
          <div className="px-6 py-3 bg-[#ff6b35]/[0.08] border-b border-[#ff6b35]/20">
            <div className="flex items-center justify-center gap-3">
              <span className="text-[#ff6b35] text-sm">🎤</span>
              <p className="text-[#ff6b35] text-[12px] font-medium">{micError}</p>
              {permissionDenied && (
                <button onClick={handleRetryMic} className="ml-2 px-3 py-1 rounded-md text-[11px] font-bold bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/25 hover:bg-[#ff6b35]/25 transition-all">
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {isVersus && room?.peerLeft && (
          <div className="px-6 py-2 bg-[#ff3b5c]/[0.06] border-b border-[#ff3b5c]/15">
            <p className="text-[#ff3b5c]/70 text-[11px] text-center">Opponent disconnected</p>
          </div>
        )}

        {analysisError && agentEnabled && (
          <div className="px-6 py-2 bg-[#ff3b5c]/[0.06] border-b border-[#ff3b5c]/15">
            <p className="text-[#ff3b5c]/70 text-[11px] text-center font-mono">Analysis: {analysisError}</p>
          </div>
        )}

        <div className="flex-1 flex min-h-0">
          <div className={`${agentEnabled ? 'w-[40%]' : 'w-full'} border-r border-white/[0.04] flex flex-col relative transition-all duration-500`}>
            {agentEnabled && (
              <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00f0ff]/8 to-transparent" />
            )}

            <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/[0.04]">
              <div className="flex items-center justify-center w-5 h-5 rounded bg-white/[0.04]">
                <span className="text-[11px] opacity-50">📝</span>
              </div>
              <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em]">
                Transcript
              </h3>
              {isVersus && webrtc.isCallActive && (
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-[5px] h-[5px] rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
                  <span className="text-[#00ff88]/40 text-[9px] font-bold tracking-wider uppercase">Call Active</span>
                </div>
              )}
              {isListening && !isVersus && (
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-[5px] h-[5px] rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
                  <span className="text-red-400/40 text-[9px] font-bold tracking-wider uppercase">Rec</span>
                </div>
              )}
              {!isListening && (mode === 'live' || mode === 'versus') && !micError && (
                <button onClick={startListening} className="ml-auto text-[9px] font-bold px-2 py-1 rounded bg-[#00f0ff]/10 text-[#00f0ff]/60 border border-[#00f0ff]/15 hover:bg-[#00f0ff]/20 transition-all">
                  Start Mic
                </button>
              )}
            </div>
            <div className="flex-1 min-h-0">
              <Transcript
                transcript={transcript}
                interimText={interimText}
                currentSpeaker={currentSpeaker}
                isListening={isListening}
                onSpeakerChange={setSpeaker}
                mode={mode}
              />
            </div>
          </div>

          {agentEnabled && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="h-[55%] min-h-[220px] border-b border-white/[0.04] relative">
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff3b5c]/8 to-transparent" />
                  <TacticAlertFeed tactics={tactics} />
                </div>
                <div className="min-h-[220px]">
                  <CounterMovePanel
                    counterMoves={counterMoves}
                    isAnalyzing={isAnalyzing}
                    situationRead={situationRead}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <PowerMeter
          score={powerScore}
          reasoning={powerReasoning}
          isAnalyzing={isAnalyzing}
        />
      </div>

      {mode === 'demo' && (
        <DemoMode
          isPlaying={demoMode.isPlaying}
          isPaused={demoMode.isPaused}
          isComplete={demoMode.isComplete}
          currentLine={demoMode.currentLine}
          onPause={demoMode.pauseDemo}
          onResume={demoMode.resumeDemo}
          onStop={handleBack}
        />
      )}
    </div>
  )
}
