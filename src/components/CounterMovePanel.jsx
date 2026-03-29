import { motion, AnimatePresence } from 'framer-motion'

const TONE_CONFIG = {
  calm: { color: '#00f0ff', label: 'Calm', bg: 'rgba(0,240,255,0.08)' },
  firm: { color: '#ff6b35', label: 'Firm', bg: 'rgba(255,107,53,0.08)' },
  empathetic: { color: '#00ff88', label: 'Empathetic', bg: 'rgba(0,255,136,0.08)' },
  assertive: { color: '#ffaa00', label: 'Assertive', bg: 'rgba(255,170,0,0.08)' },
  curious: { color: '#a78bfa', label: 'Curious', bg: 'rgba(167,139,250,0.08)' }
}

export default function CounterMovePanel({ counterMoves, isAnalyzing, situationRead }) {
  const currentMove = counterMoves?.[0]

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/[0.04]">
        <div className="flex items-center justify-center w-5 h-5 rounded bg-[#00ff88]/10">
          <span className="text-[11px]">🎯</span>
        </div>
        <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em]">
          Your Next Move
        </h3>
        {isAnalyzing && (
          <div className="ml-auto flex items-center gap-2">
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-3 rounded-full bg-[#00f0ff]/30"
                  animate={{ scaleY: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
            <span className="text-[#00f0ff]/40 text-[9px] font-bold tracking-widest uppercase">Analyzing</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {currentMove ? (
            <motion.div
              key={currentMove.say_this}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-3"
            >
              <div className="relative rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/[0.04] to-transparent" />
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#00ff88] to-[#00ff88]/40 shadow-[2px_0_12px_rgba(0,255,136,0.2)]" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#00ff88]/30 to-transparent" />

                <div className="relative p-4 ml-2">
                  <p className="text-white/90 text-[13px] leading-[1.8] font-mono tracking-wide">
                    &quot;{currentMove.say_this}&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 px-1 mt-3">
                <div className="w-4 h-4 rounded bg-[#00ff88]/8 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[9px]">💡</span>
                </div>
                <p className="text-white/35 text-[12px] leading-relaxed flex-1">
                  <span className="text-white/50 font-semibold">Strategy </span>
                  {currentMove.strategy}
                </p>
              </div>

              <div className="flex items-center gap-2 px-1">
                {(() => {
                  const tone = TONE_CONFIG[currentMove.tone] || TONE_CONFIG.calm
                  return (
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-md font-bold tracking-wider uppercase"
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
                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                  <p className="text-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">Alternative</p>
                  <p className="text-white/30 text-[12px] font-mono leading-relaxed">
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
                className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-lg opacity-20">💬</span>
              </motion.div>
              <p className="text-white/12 text-xs text-center">
                {isAnalyzing ? 'Crafting your counter-move...' : 'Counter-moves appear after analysis'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {situationRead && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-3 border-t border-white/[0.04]"
          >
            <p className="text-white/15 text-[9px] font-bold uppercase tracking-[0.15em] mb-1.5">Situation Read</p>
            <p className="text-white/35 text-[12px] leading-relaxed italic">{situationRead}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
