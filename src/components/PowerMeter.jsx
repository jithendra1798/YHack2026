import { motion } from 'framer-motion'

export default function PowerMeter({ score, reasoning, isAnalyzing }) {
  const isYouDominant = score >= 50
  const displayPercent = isYouDominant ? score : 100 - score
  const label = isYouDominant ? 'You' : 'Them'

  return (
    <div className="relative px-6 py-4 border-t border-white/[0.04] bg-[#06060b]/80 backdrop-blur-2xl">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#ff3b5c]/20 via-transparent to-[#00f0ff]/20" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#ff3b5c]/20 border border-[#ff3b5c]/20" />
          <span className="text-[#ff3b5c]/60 text-[10px] font-bold uppercase tracking-[0.15em]">Them</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/15 text-[9px] font-bold uppercase tracking-[0.2em]">Power Shift Meter</span>
          {isAnalyzing && (
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#00f0ff]/60 text-[10px] font-bold uppercase tracking-[0.15em]">You</span>
          <div className="w-3 h-3 rounded-sm bg-[#00f0ff]/20 border border-[#00f0ff]/20" />
        </div>
      </div>

      <div className="relative h-[10px] rounded-full overflow-hidden bg-white/[0.03]">
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, 
                #ff3b5c 0%, 
                #ff3b5c40 ${Math.max(score - 10, 0)}%, 
                rgba(255,255,255,0.03) ${score}%, 
                #00f0ff40 ${Math.min(score + 10, 100)}%, 
                #00f0ff 100%)`
            }}
          />
        </div>

        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-10"
          animate={{ left: `calc(${score}% - 8px)` }}
          transition={{ type: 'spring', stiffness: 100, damping: 18 }}
        >
          <div
            className="w-4 h-4 rounded-full border-[2.5px] border-white"
            style={{
              background: isYouDominant ? '#00f0ff' : '#ff3b5c',
              boxShadow: `0 0 12px ${isYouDominant ? 'rgba(0,240,255,0.7)' : 'rgba(255,59,92,0.7)'}, 
                           0 0 25px ${isYouDominant ? 'rgba(0,240,255,0.3)' : 'rgba(255,59,92,0.3)'},
                           0 0 4px rgba(255,255,255,0.5)`
            }}
          />
        </motion.div>

        <div className="absolute inset-0 rounded-full" style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)',
          pointerEvents: 'none'
        }} />
      </div>

      <div className="flex items-center justify-center mt-2.5 gap-2">
        <motion.div
          className="flex items-center gap-1.5"
          key={score}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: 'spring' }}
        >
          <span
            className="text-base font-extrabold tracking-tight font-mono"
            style={{ color: isYouDominant ? '#00f0ff' : '#ff3b5c' }}
          >
            {displayPercent}%
          </span>
          <span className="text-white/20 text-xs">→</span>
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: isYouDominant ? '#00f0ff' : '#ff3b5c' }}
          >
            {label}
          </span>
        </motion.div>
        {reasoning && (
          <span className="text-white/15 text-[10px] ml-2 max-w-[350px] truncate font-mono">
            {reasoning}
          </span>
        )}
      </div>
    </div>
  )
}
