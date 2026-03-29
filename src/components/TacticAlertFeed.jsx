import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TacticAlert from './TacticAlert'

export default function TacticAlertFeed({ tactics }) {
  const [visibleTactics, setVisibleTactics] = useState([])

  useEffect(() => {
    setVisibleTactics(tactics.slice(0, 8))
  }, [tactics])

  const dismissTactic = (id) => {
    setVisibleTactics((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-5 h-5 rounded bg-[#ff3b5c]/10">
            <span className="text-[11px]">⚠️</span>
          </div>
          <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em]">
            Tactic Alerts
          </h3>
          {visibleTactics.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-[9px] px-2 py-0.5 rounded bg-[#ff3b5c]/15 text-[#ff3b5c] font-bold font-mono border border-[#ff3b5c]/15"
            >
              {visibleTactics.length}
            </motion.span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <AnimatePresence mode="popLayout">
          {visibleTactics.map((tactic) => (
            <TacticAlert
              key={tactic.id}
              tactic={tactic}
              onDismiss={() => dismissTactic(tactic.id)}
            />
          ))}
        </AnimatePresence>

        {visibleTactics.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
            <motion.div
              className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-lg opacity-20">🛡️</span>
            </motion.div>
            <div className="text-center">
              <p className="text-white/12 text-xs">No tactics detected yet</p>
              <p className="text-white/8 text-[10px] mt-0.5">Scanning for manipulation patterns...</p>
            </div>
            <div className="flex gap-1 mt-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full bg-[#ff3b5c]/20"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
