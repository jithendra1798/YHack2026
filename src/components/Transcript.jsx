import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Transcript({
  transcript,
  interimText,
  currentSpeaker,
  isListening,
  onSpeakerChange,
  mode
}) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcript, interimText])

  return (
    <div className="flex flex-col h-full">
      {mode === 'live' && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.01]">
          <span className="text-white/20 text-[10px] uppercase tracking-[0.15em] mr-1">Speaker</span>
          <button
            onClick={() => onSpeakerChange('you')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
              currentSpeaker === 'you'
                ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/25 shadow-[0_0_12px_rgba(0,240,255,0.08)]'
                : 'text-white/25 border border-transparent hover:text-white/40'
            }`}
          >
            <div className={`w-[6px] h-[6px] rounded-full ${currentSpeaker === 'you' ? 'bg-[#00f0ff] shadow-[0_0_6px_rgba(0,240,255,0.5)]' : 'bg-white/20'}`} />
            You
          </button>
          <button
            onClick={() => onSpeakerChange('them')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
              currentSpeaker === 'them'
                ? 'bg-[#ff3b5c]/10 text-[#ff3b5c] border border-[#ff3b5c]/25 shadow-[0_0_12px_rgba(255,59,92,0.08)]'
                : 'text-white/25 border border-transparent hover:text-white/40'
            }`}
          >
            <div className={`w-[6px] h-[6px] rounded-full ${currentSpeaker === 'them' ? 'bg-[#ff3b5c] shadow-[0_0_6px_rgba(255,59,92,0.5)]' : 'bg-white/20'}`} />
            Them
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        <AnimatePresence initial={false}>
          {transcript.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: entry.speaker === 'you' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex gap-3 group"
            >
              <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-1">
                <div
                  className={`w-[7px] h-[7px] rounded-full ring-2 ${
                    entry.speaker === 'you'
                      ? 'bg-[#00f0ff] ring-[#00f0ff]/20 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                      : 'bg-[#ff3b5c] ring-[#ff3b5c]/20 shadow-[0_0_10px_rgba(255,59,92,0.4)]'
                  }`}
                />
                {index < transcript.length - 1 && (
                  <div className="w-px flex-1 bg-white/[0.04] min-h-[20px]" />
                )}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.15em] ${
                      entry.speaker === 'you' ? 'text-[#00f0ff]/60' : 'text-[#ff3b5c]/60'
                    }`}
                  >
                    {entry.speaker === 'you' ? 'You' : 'Them'}
                  </span>
                  <span className="text-white/10 text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {entry.timestamp?.toLocaleTimeString?.() || ''}
                  </span>
                </div>
                <p className="text-white/75 text-[13px] leading-[1.7] font-mono tracking-wide">
                  {entry.text}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {interimText && isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 pt-1">
              <motion.div
                className={`w-[7px] h-[7px] rounded-full ${
                  currentSpeaker === 'you' ? 'bg-[#00f0ff]/40' : 'bg-[#ff3b5c]/40'
                }`}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/20 text-[13px] leading-relaxed font-mono italic">
                {interimText}
                <span className="animate-cursor-blink ml-0.5 text-[#00f0ff]/40">|</span>
              </p>
            </div>
          </motion.div>
        )}

        {transcript.length === 0 && !interimText && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-2xl opacity-30">{mode === 'demo' ? '▶' : '🎤'}</span>
            </motion.div>
            <div className="text-center">
              <p className="text-white/15 text-sm">
                {mode === 'demo' ? 'Initializing demo...' : 'Listening for conversation...'}
              </p>
              <p className="text-white/8 text-[11px] mt-1">
                {mode === 'demo' ? 'Audio playback will begin shortly' : 'Toggle speaker above as conversation flows'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
