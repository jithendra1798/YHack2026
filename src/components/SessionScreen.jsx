import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header'
import Transcript from './Transcript'
import TacticAlertFeed from './TacticAlertFeed'
import CounterMovePanel from './CounterMovePanel'
import PowerMeter from './PowerMeter'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useClaudeAnalysis } from '../hooks/useClaudeAnalysis'
import { useDemoMode } from '../hooks/useDemoMode'
import { useWebRTC } from '../hooks/useWebRTC'

export default function SessionScreen({ context, mode, room, onBack }) {
  const [agentEnabled, setAgentEnabled] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [showTranscript, setShowTranscript] = useState(true)

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
    updateOrAddRemoteEntry,
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
    injectAnalysis,
    reset: resetAnalysis
  } = useClaudeAnalysis(transcript, context, transcriptVersion)

  const demoMode = useDemoMode({ addTranscriptEntry, injectAnalysis })

  const isVersus = mode === 'versus'
  const webrtc = useWebRTC({
    sendSignal: isVersus ? room?.sendSignal : () => {},
    onSignal: isVersus ? room?.onSignal : () => {},
    isInitiator: isVersus && room?.role === 'host'
  })

  useEffect(() => {
    if (mode === 'live' && isSupported) {
      startListening()
      return () => stopListening()
    }
  }, [mode, isSupported, startListening, stopListening])

  useEffect(() => {
    if (mode === 'demo') {
      clearTranscript()
      resetAnalysis()
      const timer = setTimeout(() => {
        demoMode.startDemo()
      }, 500)
      return () => {
        clearTimeout(timer)
        demoMode.stopDemo()
      }
    }
  }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isVersus || !room) return

    webrtc.startCall()
    startListening()

    room.onRemoteTranscript((entry) => {
      updateOrAddRemoteEntry(entry)
    })

    room.onPeerEnded(() => {
      handleEnd()
    })

    return () => {
      stopListening()
      webrtc.endCall()
    }
  }, [isVersus]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isVersus) return
    setSpeaker('you')
  }, [isVersus, setSpeaker])

  // Send local transcript to peer — include sourceId for append-matching
  useEffect(() => {
    if (!isVersus || !room) return
    if (transcript.length === 0) return
    const lastEntry = transcript[transcript.length - 1]
    if (lastEntry.speaker === 'you') {
      room.sendTranscriptEntry({
        speaker: lastEntry.speaker,
        text: lastEntry.text,
        sourceId: lastEntry.id
      })
    }
  }, [transcriptVersion]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleMute = () => {
    if (isMuted) {
      startListening()
      if (webrtc.localStream) {
        webrtc.localStream.getAudioTracks().forEach((t) => { t.enabled = true })
      }
    } else {
      stopListening()
      if (webrtc.localStream) {
        webrtc.localStream.getAudioTracks().forEach((t) => { t.enabled = false })
      }
    }
    setIsMuted(!isMuted)
  }

  const handleEnd = () => {
    if (isVersus && room) {
      room.endSession()
      webrtc.endCall()
    }
    stopListening()
    demoMode.stopDemo()
    clearTranscript()
    resetAnalysis()
    onBack()
  }

  const handleRetryMic = () => {
    startListening()
  }

  return (
    <div className="h-screen flex flex-col bg-[#09090b] overflow-hidden relative">
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div className="relative z-10 flex flex-col h-full">
        <Header
          mode={mode}
          isListening={isListening && !isMuted}
          onBack={mode === 'demo' ? handleEnd : null}
          roomCode={isVersus ? room?.roomCode : null}
          peerConnected={isVersus ? room?.peerConnected : false}
          agentEnabled={agentEnabled}
          onToggleAgent={() => setAgentEnabled((v) => !v)}
          isMuted={isMuted}
          onToggleMute={(mode === 'live' || mode === 'versus') ? handleToggleMute : undefined}
          onEndCall={(mode === 'live' || mode === 'versus') ? handleEnd : undefined}
          showTranscript={showTranscript}
          onToggleTranscript={() => setShowTranscript((v) => !v)}
        />

        {!isSupported && (mode === 'live' || mode === 'versus') && (
          <div className="px-6 py-2.5 bg-amber-500/[0.08] border-b border-amber-500/20">
            <p className="text-amber-400 text-[12px] text-center font-medium">
              Speech recognition requires Google Chrome.
            </p>
          </div>
        )}

        {micError && (mode === 'live' || mode === 'versus') && (
          <div className="px-6 py-3 bg-amber-500/[0.08] border-b border-amber-500/20">
            <div className="flex items-center justify-center gap-3">
              <p className="text-amber-400 text-[12px] font-medium">{micError}</p>
              {permissionDenied && (
                <button onClick={handleRetryMic} className="ml-2 px-3 py-1 rounded-md text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25 transition-all">
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {isVersus && room?.peerLeft && (
          <div className="px-6 py-2 bg-rose-500/[0.06] border-b border-rose-500/15">
            <p className="text-rose-400/70 text-[11px] text-center">Opponent disconnected</p>
          </div>
        )}

        {analysisError && agentEnabled && mode !== 'demo' && (
          <div className="px-6 py-2 bg-rose-500/[0.06] border-b border-rose-500/15">
            <p className="text-rose-400/70 text-[11px] text-center font-mono">Analysis: {analysisError}</p>
          </div>
        )}

        <div className="flex-1 flex min-h-0">
          {showTranscript && (
            <div className={`${agentEnabled ? 'w-[40%]' : 'w-full'} border-r border-white/[0.06] flex flex-col relative transition-all duration-500`}>
              {agentEnabled && (
                <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent" />
              )}

              <div className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-white/[0.04]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                </div>
                <h3 className="text-white/45 text-[11px] font-semibold uppercase tracking-wider">
                  Transcript
                </h3>
                {isVersus && webrtc.isCallActive && (
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-[5px] h-[5px] rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    <span className="text-emerald-400/50 text-[9px] font-semibold tracking-wider uppercase">Connected</span>
                  </div>
                )}
                {isListening && !isVersus && !isMuted && (
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-[5px] h-[5px] rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse" />
                    <span className="text-rose-400/50 text-[9px] font-semibold tracking-wider uppercase">Rec</span>
                  </div>
                )}
                {isMuted && (
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="text-rose-400/50 text-[9px] font-semibold tracking-wider uppercase">Muted</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-h-0">
                <Transcript
                  transcript={transcript}
                  interimText={isMuted ? '' : interimText}
                  currentSpeaker={currentSpeaker}
                  isListening={isListening && !isMuted}
                  onSpeakerChange={setSpeaker}
                  mode={mode}
                />
              </div>
            </div>
          )}

          {agentEnabled && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className={`${showTranscript ? 'h-[55%]' : 'h-[50%]'} min-h-[220px] border-b border-white/[0.06] relative`}>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/10 to-transparent" />
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

          {!agentEnabled && !showTranscript && (
            <div className="flex-1 flex items-center justify-center text-white/10 text-sm">
              Transcript and AI hidden. Use header toggles to show.
            </div>
          )}
        </div>

        <PowerMeter
          score={powerScore}
          reasoning={powerReasoning}
          isAnalyzing={isAnalyzing}
        />
      </div>

      <AnimatePresence>
        {mode === 'demo' && demoMode.narratorMessage && (
          <motion.div
            key="narrator-cloud"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[90%]"
          >
            <div className="relative bg-[#0f0f14]/95 backdrop-blur-2xl border border-violet-500/20 rounded-2xl px-8 py-5 shadow-[0_8px_60px_rgba(139,92,246,0.15),0_0_0_1px_rgba(139,92,246,0.08)]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/[0.06] to-indigo-500/[0.03]" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/15 to-transparent" />
              <p className="relative text-white/80 text-base font-medium text-center leading-relaxed">
                {demoMode.narratorMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DemoMode bottom bar hidden for clean demo presentation */}
    </div>
  )
}
