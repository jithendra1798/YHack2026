import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const getMeaning = (score) => {
  if (score <= 20) return 'They dominate'
  if (score <= 35) return 'They lead'
  if (score <= 45) return 'Slight disadvantage'
  if (score <= 55) return 'Even ground'
  if (score <= 65) return 'Slight advantage'
  if (score <= 80) return 'You lead'
  return 'You dominate'
}

export default function PowerMeter({ score, reasoning, isAnalyzing }) {
  const [displayScore, setDisplayScore] = useState(score)

  useEffect(() => {
    if (displayScore === score) return
    const timer = setInterval(() => {
      setDisplayScore((prev) => {
        if (prev < score) return prev + 1
        if (prev > score) return prev - 1
        return prev
      })
    }, 35)
    return () => clearInterval(timer)
  }, [score, displayScore])

  const isYouDominant = displayScore >= 50
  const meaning = getMeaning(displayScore)

  return (
    <div className="relative px-6 py-5 border-t border-white/[0.06] bg-[#09090b]/80 backdrop-blur-2xl">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-rose-500/20 via-transparent to-indigo-500/20" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-rose-500/20 border border-rose-500/20" />
          <span className="text-rose-400/60 text-[10px] font-semibold uppercase tracking-wider">Them</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/20 text-[9px] font-semibold uppercase tracking-widest">Power Balance</span>
          {isAnalyzing && (
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-indigo-400/60 text-[10px] font-semibold uppercase tracking-wider">You</span>
          <div className="w-3 h-3 rounded-sm bg-indigo-500/20 border border-indigo-500/20" />
        </div>
      </div>

      <div className="relative h-[10px] rounded-full overflow-hidden bg-white/[0.03]">
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, 
                #fb7185 0%, 
                #fb718540 ${Math.max(displayScore - 10, 0)}%, 
                rgba(255,255,255,0.03) ${displayScore}%, 
                #818cf840 ${Math.min(displayScore + 10, 100)}%, 
                #818cf8 100%)`
            }}
          />
        </div>

        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-10"
          animate={{ left: `calc(${displayScore}% - 8px)` }}
          transition={{ duration: 0.15, ease: 'linear' }}
        >
          <div
            className="w-4 h-4 rounded-full border-[2.5px] border-white"
            style={{
              background: isYouDominant ? '#818cf8' : '#fb7185',
              boxShadow: `0 0 12px ${isYouDominant ? 'rgba(129,140,248,0.7)' : 'rgba(251,113,133,0.7)'}, 
                           0 0 20px ${isYouDominant ? 'rgba(129,140,248,0.3)' : 'rgba(251,113,133,0.3)'},
                           0 0 4px rgba(255,255,255,0.4)`
            }}
          />
        </motion.div>

        <div className="absolute inset-0 rounded-full" style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)',
          pointerEvents: 'none'
        }} />
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <div className="flex items-center gap-2">
          <span
            className="text-lg font-extrabold tracking-tight font-mono"
            style={{ color: isYouDominant ? '#818cf8' : '#fb7185' }}
          >
            {displayScore}%
          </span>
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: isYouDominant ? 'rgba(129,140,248,0.7)' : 'rgba(251,113,133,0.7)' }}
          >
            {meaning}
          </span>
        </div>
        {reasoning && (
          <span className="text-white/25 text-[10px] max-w-[300px] truncate font-mono">
            {reasoning}
          </span>
        )}
      </div>
    </div>
  )
}
