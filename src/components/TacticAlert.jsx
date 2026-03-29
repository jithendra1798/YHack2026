import { motion } from 'framer-motion'
import { getTacticMeta, getSeverityColor } from '../lib/tactics'

export default function TacticAlert({ tactic, onDismiss }) {
  const meta = getTacticMeta(tactic.tactic_name)
  const severityColor = getSeverityColor(tactic.severity)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: 40 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="relative group animate-alert-shake"
    >
      <div
        className="absolute -inset-px rounded-xl opacity-30 blur-sm pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${severityColor}20, transparent 60%)` }}
      />

      <div
        className="relative bg-white/[0.02] backdrop-blur-xl rounded-xl p-3.5 border overflow-hidden"
        style={{
          borderColor: `${severityColor}25`,
        }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{
            background: `linear-gradient(to bottom, ${severityColor}, ${severityColor}60)`,
            boxShadow: `2px 0 12px ${severityColor}30`
          }}
        />

        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(to right, ${severityColor}40, transparent 60%)` }}
        />

        <div className="flex items-start justify-between gap-2 ml-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm">{meta.icon}</span>
              <span
                className="text-[11px] font-extrabold uppercase tracking-[0.1em]"
                style={{ color: severityColor }}
              >
                {tactic.tactic_name}
              </span>
              <span
                className="text-[9px] px-1.5 py-[2px] rounded font-bold font-mono"
                style={{
                  backgroundColor: `${severityColor}12`,
                  color: severityColor,
                  border: `1px solid ${severityColor}20`
                }}
              >
                {tactic.confidence}%
              </span>
            </div>

            <p className="text-white/50 text-[12px] leading-relaxed mb-2">
              {tactic.description}
            </p>

            {tactic.evidence && (
              <div
                className="flex gap-2 items-start mt-2 px-2.5 py-2 rounded-lg bg-white/[0.02]"
                style={{ borderLeft: `2px solid ${severityColor}25` }}
              >
                <span className="text-[9px] text-white/20 mt-px shrink-0">EVIDENCE</span>
                <p className="text-white/30 text-[11px] italic leading-relaxed">
                  &quot;{tactic.evidence}&quot;
                </p>
              </div>
            )}
          </div>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-white/10 hover:text-white/40 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 p-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
