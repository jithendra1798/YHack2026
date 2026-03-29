import { useState } from 'react'
import { motion } from 'framer-motion'
import { DEMO_CONTEXT } from '../lib/demoScript'

const NEGOTIATION_TYPES = [
  'Salary Negotiation',
  'Rent Renewal',
  'Medical Bill',
  'Contract Negotiation',
  'Car Purchase',
  'Freelance Rate',
  'Other'
]

const QUICK_SCENARIOS = [
  {
    label: 'Rent Renewal',
    icon: '🏠',
    data: {
      negotiationType: 'Rent Renewal',
      userGoal: 'Keep rent at current $2,400 or negotiate maximum $100 increase',
      otherPartyRole: 'Landlord / Property Manager',
      keyFacts: '3 years perfect payment history. Comparable units average $2,100-$2,300. Building has 15% vacancy rate.',
      batna: 'Comparable unit at $2,150/month on Zillow, 0.3 miles away'
    }
  },
  {
    label: 'Salary Raise',
    icon: '💼',
    data: {
      negotiationType: 'Salary Negotiation',
      userGoal: 'Negotiate a 15-20% salary increase from current $85K to $100K+',
      otherPartyRole: 'Engineering Manager / HR',
      keyFacts: '2 years at company, consistently exceeded targets, led 3 major projects. Market rate for role is $95K-$110K.',
      batna: 'Offer from competing company at $105K with similar benefits'
    }
  },
  {
    label: 'Medical Bill',
    icon: '🏥',
    data: {
      negotiationType: 'Medical Bill',
      userGoal: 'Reduce $4,200 ER bill by at least 40% or set up interest-free payment plan',
      otherPartyRole: 'Hospital Billing Department',
      keyFacts: 'Insured but out-of-network. Fair Health price for procedure is $1,800. Hospital has financial assistance programs.',
      batna: 'Can dispute through insurance appeal process or negotiate with collection agency later at reduced rate'
    }
  }
]

export default function SetupScreen({ onStartLive, onStartDemo }) {
  const [context, setContext] = useState({
    negotiationType: '',
    userGoal: '',
    otherPartyRole: '',
    keyFacts: '',
    batna: ''
  })

  const handleChange = (field) => (e) => {
    setContext((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const loadScenario = (scenario) => {
    setContext(scenario.data)
  }

  const isValid = context.negotiationType && context.userGoal && context.otherPartyRole

  const inputClass = 'w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-white/90 text-sm placeholder:text-white/15 focus:outline-none focus:border-[#00f0ff]/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(0,240,255,0.06)] transition-all duration-300'

  return (
    <div className="min-h-screen bg-[#06060b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute inset-0 noise-overlay opacity-30" />

      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#00f0ff]/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#ff3b5c]/[0.015] blur-[100px] pointer-events-none" />

      <motion.div
        className="w-full max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.21, 1.11, 0.81, 0.99] }}
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6, type: 'spring' }}
          >
            <h1 className="text-6xl font-extrabold text-white tracking-tighter mb-1">
              PAR<span className="text-[#00f0ff]">L</span>EY
            </h1>
            <div className="h-[2px] w-20 mx-auto bg-gradient-to-r from-transparent via-[#00f0ff]/60 to-transparent mb-4" />
          </motion.div>
          <motion.p
            className="text-white/30 text-base tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Real-time AI negotiation intelligence
          </motion.p>
        </div>

        <motion.div
          className="glass-card rounded-2xl p-8 shadow-[0_0_80px_rgba(0,240,255,0.03)]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase">
              Mission Briefing
            </h2>
            <div className="h-px flex-1 ml-4 bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="mb-6">
            <label className="block text-white/30 text-[11px] uppercase tracking-widest mb-2.5">
              Quick Load Scenario
            </label>
            <div className="flex gap-2">
              {QUICK_SCENARIOS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => loadScenario(s)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/80 hover:bg-white/[0.06] hover:border-[#00f0ff]/20 transition-all duration-200"
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/30 text-[11px] uppercase tracking-widest mb-2">
                Negotiation Type
              </label>
              <select
                value={context.negotiationType}
                onChange={handleChange('negotiationType')}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="" className="bg-[#0d0d15]">Select type...</option>
                {NEGOTIATION_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-[#0d0d15]">{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/30 text-[11px] uppercase tracking-widest mb-2">
                Your Objective
              </label>
              <input
                type="text"
                value={context.userGoal}
                onChange={handleChange('userGoal')}
                placeholder="What outcome are you fighting for?"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-white/30 text-[11px] uppercase tracking-widest mb-2">
                Opposing Party
              </label>
              <input
                type="text"
                value={context.otherPartyRole}
                onChange={handleChange('otherPartyRole')}
                placeholder="Who are you negotiating with?"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-white/30 text-[11px] uppercase tracking-widest mb-2">
                Intel &amp; Key Facts
              </label>
              <textarea
                value={context.keyFacts}
                onChange={handleChange('keyFacts')}
                placeholder="What leverage do you have? Data, history, comparables..."
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="block text-white/30 text-[11px] uppercase tracking-widest mb-2">
                BATNA
                <span className="ml-2 text-white/15 normal-case tracking-normal">
                  (your Plan B if this fails)
                </span>
              </label>
              <input
                type="text"
                value={context.batna}
                onChange={handleChange('batna')}
                placeholder="Your best alternative to a negotiated agreement"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <motion.button
              onClick={() => isValid && onStartLive(context)}
              disabled={!isValid}
              className={`flex-1 relative group flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden ${
                isValid
                  ? 'text-[#00f0ff] border border-[#00f0ff]/30 hover:border-[#00f0ff]/60'
                  : 'text-white/15 border border-white/[0.05] cursor-not-allowed'
              }`}
              whileHover={isValid ? { scale: 1.01 } : {}}
              whileTap={isValid ? { scale: 0.99 } : {}}
            >
              {isValid && (
                <div className="absolute inset-0 bg-[#00f0ff]/[0.06] group-hover:bg-[#00f0ff]/[0.1] transition-all" />
              )}
              <span className="relative text-base">🎤</span>
              <span className="relative">Start Live Session</span>
            </motion.button>

            <motion.button
              onClick={() => onStartDemo(DEMO_CONTEXT)}
              className="flex-1 relative group flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-sm text-white/50 border border-white/[0.08] hover:text-white/90 hover:border-[#00ff88]/30 transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="absolute inset-0 bg-white/[0.02] group-hover:bg-[#00ff88]/[0.05] transition-all" />
              <span className="relative text-base">▶</span>
              <span className="relative">Run Demo</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.p
          className="text-center text-white/10 text-[11px] mt-6 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Zero data stored. Everything runs in your browser.
        </motion.p>
      </motion.div>
    </div>
  )
}
