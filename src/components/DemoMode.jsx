import { motion, AnimatePresence } from 'framer-motion'
import { DEMO_SCRIPT } from '../lib/demoScript'

export default function DemoMode({ isPlaying, isPaused, isComplete, currentLine, onPause, onResume, onStop }) {
  const progress = currentLine >= 0 ? ((currentLine + 1) / DEMO_SCRIPT.length) * 100 : 0

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-4 bg-[#06060b]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl px-5 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)]">
            <div className="relative w-28 h-[6px] rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#00ff88]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 rounded-full" style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)'
              }} />
            </div>

            <span className="text-white/25 text-[10px] font-mono font-bold min-w-[4ch]">
              {currentLine + 1}/{DEMO_SCRIPT.length}
            </span>

            <div className="w-px h-4 bg-white/[0.06]" />

            {isPaused ? (
              <motion.button
                onClick={onResume}
                className="w-8 h-8 rounded-lg bg-[#00f0ff]/8 border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] hover:bg-[#00f0ff]/15 transition-all text-xs"
                whileTap={{ scale: 0.9 }}
              >
                ▶
              </motion.button>
            ) : (
              <motion.button
                onClick={onPause}
                className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40 hover:bg-white/[0.06] transition-all text-xs"
                whileTap={{ scale: 0.9 }}
              >
                ⏸
              </motion.button>
            )}

            <motion.button
              onClick={onStop}
              className="w-8 h-8 rounded-lg bg-[#ff3b5c]/8 border border-[#ff3b5c]/20 flex items-center justify-center text-[#ff3b5c] hover:bg-[#ff3b5c]/15 transition-all text-xs"
              whileTap={{ scale: 0.9 }}
            >
              ⏹
            </motion.button>

            {isComplete && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[#00ff88] text-[10px] font-bold tracking-wider uppercase"
              >
                Done
              </motion.span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
