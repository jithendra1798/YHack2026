import { motion } from 'framer-motion'

export default function Header({ mode, isListening, onBack }) {
  return (
    <header className="relative flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-[#06060b]/90 backdrop-blur-2xl z-50">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/10 to-transparent" />

      <div className="flex items-center gap-3">
        {onBack && (
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

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
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
      </div>

      <div className="flex items-center gap-3">
        {mode === 'live' && isListening && (
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
