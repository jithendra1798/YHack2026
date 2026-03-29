import { AnimatePresence, motion } from 'framer-motion'
import TacticAlert from './TacticAlert'

export default function TacticAlertFeed({ tactics }) {
  // Always show the top 3 most recent tactics
  const topTactics = tactics.slice(0, 3)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-500/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-400"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </div>
          <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider">
            Tactic Alerts
          </h3>
          {topTactics.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-[9px] px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-400 font-semibold font-mono border border-rose-500/15"
            >
              {tactics.length}
            </motion.span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {topTactics.map((tactic) => (
            <TacticAlert
              key={tactic.id}
              tactic={tactic}
            />
          ))}
        </AnimatePresence>

        {topTactics.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/8 to-orange-500/8 border border-white/[0.05] flex items-center justify-center"
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-400/30"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </motion.div>
            <div className="text-center">
              <p className="text-white/15 text-xs">No tactics detected yet</p>
              <p className="text-white/10 text-[10px] mt-0.5">Scanning for manipulation patterns...</p>
            </div>
            <div className="flex gap-1 mt-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full bg-rose-400/20"
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
