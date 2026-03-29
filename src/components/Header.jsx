import { motion } from 'framer-motion'

export default function Header({ mode, isListening, onBack, roomCode, peerConnected, agentEnabled, onToggleAgent, isMuted, onToggleMute, onEndCall, showTranscript, onToggleTranscript }) {
  return (
    <header className="relative flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-[#06060b]/90 backdrop-blur-2xl z-50">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/10 to-transparent" />

      <div className="flex items-center gap-3">
        {onBack && !onEndCall && (
          <motion.button
            onClick={onBack}
            className="text-white/25 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/[0.04]"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}
        <motion.div
          className="flex items-center gap-1.5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-lg font-extrabold tracking-tighter text-white/90">
            PAR<span className="text-[#00f0ff]">L</span>EY
          </span>
        </motion.div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        {mode === 'live' && (
          <motion.div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/[0.06]"
            animate={{ opacity: isListening ? [1, 0.6, 1] : 1 }}
            transition={{ duration: 2, repeat: isListening ? Infinity : 0 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-red-500"
              animate={{ scale: isListening ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-red-400/90 text-[10px] font-bold tracking-[0.15em] uppercase">Live</span>
          </motion.div>
        )}
        {mode === 'demo' && (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/[0.06]">
            <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
            <span className="text-[#00f0ff]/90 text-[10px] font-bold tracking-[0.15em] uppercase">Demo Mode</span>
          </div>
        )}
        {mode === 'versus' && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#a78bfa]/20 bg-[#a78bfa]/[0.06]">
              <span className="text-[#a78bfa]/90 text-[10px]">⚔</span>
              <span className="text-[#a78bfa]/90 text-[10px] font-bold tracking-[0.15em] uppercase">Versus</span>
            </div>
            {roomCode && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02]">
                <span className="text-white/40 text-[9px] font-mono tracking-[0.2em]">{roomCode}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${peerConnected ? 'bg-[#00ff88] shadow-[0_0_6px_rgba(0,255,136,0.5)]' : 'bg-[#ff3b5c]'}`} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onToggleAgent !== undefined && (
          <button
            onClick={onToggleAgent}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
              agentEnabled
                ? 'bg-[#00f0ff]/10 text-[#00f0ff]/80 border border-[#00f0ff]/20'
                : 'bg-white/[0.02] text-white/20 border border-white/[0.05]'
            }`}
          >
            <div className={`w-6 h-3.5 rounded-full relative transition-all duration-300 ${agentEnabled ? 'bg-[#00f0ff]/30' : 'bg-white/10'}`}>
              <motion.div
                className={`absolute top-0.5 w-2.5 h-2.5 rounded-full ${agentEnabled ? 'bg-[#00f0ff]' : 'bg-white/30'}`}
                animate={{ left: agentEnabled ? 12 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
            AI {agentEnabled ? 'On' : 'Off'}
          </button>
        )}

        {onToggleTranscript !== undefined && (
          <button
            onClick={onToggleTranscript}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showTranscript
                ? 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/60'
                : 'bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/25'
            }`}
            title={showTranscript ? 'Hide Transcript' : 'Show Transcript'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {showTranscript ? (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              ) : (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              )}
            </svg>
          </button>
        )}

        {onToggleMute !== undefined && (
          <motion.button
            onClick={onToggleMute}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isMuted
                ? 'bg-[#ff3b5c]/15 text-[#ff3b5c] border border-[#ff3b5c]/25'
                : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/60'
            }`}
            whileTap={{ scale: 0.9 }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.12 1.49-.34 2.18" />
                <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </motion.button>
        )}

        {onEndCall && (
          <motion.button
            onClick={onEndCall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff3b5c]/10 text-[#ff3b5c] text-[10px] font-bold uppercase tracking-wider border border-[#ff3b5c]/20 hover:bg-[#ff3b5c]/20 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            End
          </motion.button>
        )}

        {(mode === 'live' || mode === 'versus') && isListening && !isMuted && (
          <div className="flex items-center gap-1">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-[3px] bg-[#00f0ff]/60 rounded-full"
                animate={{ height: [4, 12 + Math.random() * 8, 4] }}
                transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
