import { motion, AnimatePresence } from 'framer-motion'

const TONE_CONFIG = {
  calm: { color: '#818cf8', label: 'Calm', bg: 'rgba(129,140,248,0.08)' },
  firm: { color: '#fb923c', label: 'Firm', bg: 'rgba(251,146,60,0.08)' },
  empathetic: { color: '#34d399', label: 'Empathetic', bg: 'rgba(52,211,153,0.08)' },
  assertive: { color: '#fbbf24', label: 'Assertive', bg: 'rgba(251,191,36,0.08)' },
  curious: { color: '#a78bfa', label: 'Curious', bg: 'rgba(167,139,250,0.08)' }
}

export default function CounterMovePanel({ counterMoves, isAnalyzing, situationRead }) {
  const currentMove = counterMoves?.[0]

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400"><circle cx="12" cy="12" r="10" /><path d="M16 12l-4-4-4 4" /><path d="M12 16V8" /></svg>
        </div>
        <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider">
          Your Next Move
        </h3>
        {isAnalyzing && (
          <div className="ml-auto flex items-center gap-2">
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-3 rounded-full bg-indigo-400/30"
                  animate={{ scaleY: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
            <span className="text-indigo-400/40 text-[9px] font-semibold tracking-widest uppercase">Analyzing</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {currentMove ? (
            <motion.div
              key={currentMove.say_this}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-4"
            >
              <div className="relative rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] to-transparent" />
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-emerald-400 to-emerald-400/40 shadow-[2px_0_12px_rgba(52,211,153,0.15)]" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-emerald-400/30 to-transparent" />

                <div className="relative p-5 ml-2">
                  <p className="text-white/90 text-base font-medium leading-[1.9]">
                    &quot;{currentMove.say_this}&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 px-1 mt-4">
                <div className="w-5 h-5 rounded-md bg-emerald-500/8 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400/60"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                </div>
                <p className="text-white/40 text-[13px] leading-relaxed flex-1">
                  <span className="text-white/55 font-medium">Strategy </span>
                  {currentMove.strategy}
                </p>
              </div>

              <div className="flex items-center gap-2 px-1">
                {(() => {
                  const tone = TONE_CONFIG[currentMove.tone] || TONE_CONFIG.calm
                  return (
                    <span
                      className="text-[11px] px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase"
                      style={{
                        backgroundColor: tone.bg,
                        color: tone.color,
                        border: `1px solid ${tone.color}20`
                      }}
                    >
                      {tone.label}
                    </span>
                  )
                })()}
              </div>

              {counterMoves?.[1] && (
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <p className="text-white/25 text-[11px] font-semibold uppercase tracking-wider mb-2.5">Alternative</p>
                  <p className="text-white/35 text-[13px] leading-relaxed">
                    &quot;{counterMoves[1].say_this}&quot;
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-3 py-8"
            >
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/8 to-teal-500/8 border border-white/[0.05] flex items-center justify-center"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400/30"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              </motion.div>
              <p className="text-white/15 text-xs text-center">
                {isAnalyzing ? 'Crafting your counter-move...' : 'Counter-moves appear after analysis'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {situationRead && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 pt-4 border-t border-white/[0.06]"
          >
            <p className="text-white/25 text-[11px] font-semibold uppercase tracking-wider mb-2">Situation Read</p>
            <p className="text-white/40 text-[13px] leading-relaxed italic">{situationRead}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
