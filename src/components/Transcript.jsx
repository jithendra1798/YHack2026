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
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/[0.06] bg-white/[0.01]">
          <span className="text-white/25 text-[10px] font-medium mr-1">Speaker</span>
          <button
            onClick={() => onSpeakerChange('you')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
              currentSpeaker === 'you'
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25'
                : 'text-white/25 border border-transparent hover:text-white/40'
            }`}
          >
            <div className={`w-[6px] h-[6px] rounded-full ${currentSpeaker === 'you' ? 'bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.5)]' : 'bg-white/20'}`} />
            You
          </button>
          <button
            onClick={() => onSpeakerChange('them')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
              currentSpeaker === 'them'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                : 'text-white/25 border border-transparent hover:text-white/40'
            }`}
          >
            <div className={`w-[6px] h-[6px] rounded-full ${currentSpeaker === 'them' ? 'bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.5)]' : 'bg-white/20'}`} />
            Them
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {transcript.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: entry.speaker === 'you' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex gap-4 group"
            >
              <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-1.5">
                <div
                  className={`w-2 h-2 rounded-full ring-2 ${
                    entry.speaker === 'you'
                      ? 'bg-indigo-400 ring-indigo-400/20 shadow-[0_0_8px_rgba(129,140,248,0.3)]'
                      : 'bg-rose-400 ring-rose-400/20 shadow-[0_0_8px_rgba(251,113,133,0.3)]'
                  }`}
                />
                {index < transcript.length - 1 && (
                  <div className="w-px flex-1 bg-white/[0.04] min-h-[24px]" />
                )}
              </div>
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider ${
                      entry.speaker === 'you' ? 'text-indigo-400/70' : 'text-rose-400/70'
                    }`}
                  >
                    {entry.speaker === 'you' ? 'You' : 'Them'}
                  </span>
                  <span className="text-white/10 text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {entry.timestamp?.toLocaleTimeString?.() || ''}
                  </span>
                </div>
                <p className="text-white/75 text-sm leading-[1.9]">
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
                  currentSpeaker === 'you' ? 'bg-indigo-400/40' : 'bg-rose-400/40'
                }`}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/20 text-sm leading-relaxed italic">
                {interimText}
                <span className="animate-cursor-blink ml-0.5 text-indigo-400/40">|</span>
              </p>
            </div>
          </motion.div>
        )}

        {transcript.length === 0 && !interimText && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <motion.div
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-white/[0.06] flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400/40">
                {mode === 'demo' ? <polygon points="5 3 19 12 5 21 5 3" /> : <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></>}
              </svg>
            </motion.div>
            <div className="text-center">
              <p className="text-white/20 text-sm">
                {mode === 'demo' ? 'Initializing demo...' : 'Listening for conversation...'}
              </p>
              <p className="text-white/10 text-[11px] mt-1">
                {mode === 'demo' ? 'Audio playback will begin shortly' : 'Toggle speaker above as conversation flows'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
