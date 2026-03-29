import { useEffect, useState } from 'react'
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
    reset: resetAnalysis
  } = useClaudeAnalysis(transcript, context, transcriptVersion)

  const demoMode = useDemoMode({ addTranscriptEntry, triggerAnalysis })

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
      }, 1000)
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
    <div className="h-screen flex flex-col bg-[#06060b] overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.5]" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute inset-0 scanline" />

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
          <div className="px-6 py-2.5 bg-[#ff6b35]/[0.08] border-b border-[#ff6b35]/20">
            <p className="text-[#ff6b35] text-[12px] text-center font-medium">
              Speech recognition requires Google Chrome.
            </p>
          </div>
        )}

        {micError && (mode === 'live' || mode === 'versus') && (
          <div className="px-6 py-3 bg-[#ff6b35]/[0.08] border-b border-[#ff6b35]/20">
            <div className="flex items-center justify-center gap-3">
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
          {showTranscript && (
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
                    <span className="text-[#00ff88]/40 text-[9px] font-bold tracking-wider uppercase">Connected</span>
                  </div>
                )}
                {isListening && !isVersus && !isMuted && (
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-[5px] h-[5px] rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
                    <span className="text-red-400/40 text-[9px] font-bold tracking-wider uppercase">Rec</span>
                  </div>
                )}
                {isMuted && (
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="text-[#ff3b5c]/40 text-[9px] font-bold tracking-wider uppercase">Muted</span>
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
                <div className={`${showTranscript ? 'h-[55%]' : 'h-[50%]'} min-h-[220px] border-b border-white/[0.04] relative`}>
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

      {mode === 'demo' && (
        <DemoMode
          isPlaying={demoMode.isPlaying}
          isPaused={demoMode.isPaused}
          isComplete={demoMode.isComplete}
          currentLine={demoMode.currentLine}
          onPause={demoMode.pauseDemo}
          onResume={demoMode.resumeDemo}
          onStop={handleEnd}
        />
      )}
    </div>
  )
}
