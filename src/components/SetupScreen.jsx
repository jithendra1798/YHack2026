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

export default function SetupScreen({ onStartLive, onStartDemo, onStartVersus }) {
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

  const inputClass = 'w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-5 py-4 text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-indigo-500/20 transition-all duration-300'

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-dots opacity-60" />

      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-500/[0.03] blur-[130px] pointer-events-none" />

      <motion.div
        className="w-full max-w-3xl relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h1 className="font-brand text-7xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                PARLEY
              </span>
            </h1>
          </motion.div>
          <motion.p
            className="text-white/40 text-lg font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            Real-time AI negotiation intelligence
          </motion.p>
        </div>

        <motion.div
          className="glass-card rounded-2xl p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
              </svg>
            </div>
            <h2 className="text-white/70 text-base font-semibold">Briefing</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
          </div>

          <div className="mb-10">
            <label className="block text-white/35 text-sm font-medium mb-3">
              Quick start
            </label>
            <div className="flex gap-3">
              {QUICK_SCENARIOS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => loadScenario(s)}
                  className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-medium bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/80 hover:bg-white/[0.06] hover:border-indigo-500/25 transition-all duration-200"
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white/35 text-sm font-medium mb-2.5">Type</label>
              <select
                value={context.negotiationType}
                onChange={handleChange('negotiationType')}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="" className="bg-[#111113]">Select type...</option>
                {NEGOTIATION_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-[#111113]">{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/35 text-sm font-medium mb-2.5">Your Objective</label>
              <input
                type="text"
                value={context.userGoal}
                onChange={handleChange('userGoal')}
                placeholder="What outcome are you fighting for?"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-white/35 text-sm font-medium mb-2.5">Opposing Party</label>
              <input
                type="text"
                value={context.otherPartyRole}
                onChange={handleChange('otherPartyRole')}
                placeholder="Who are you negotiating with?"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-white/35 text-sm font-medium mb-2.5">Intel &amp; Key Facts</label>
              <textarea
                value={context.keyFacts}
                onChange={handleChange('keyFacts')}
                placeholder="What leverage do you have? Data, history, comparables..."
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="block text-white/35 text-sm font-medium mb-2.5">
                BATNA
                <span className="ml-1.5 text-white/20 font-normal">(your Plan B)</span>
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

          <div className="flex gap-4 mt-12">
            <motion.button
              onClick={() => isValid && onStartLive(context)}
              disabled={!isValid}
              className={`flex-1 relative group flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 overflow-hidden ${
                isValid
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:brightness-110'
                  : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
              }`}
              whileHover={isValid ? { scale: 1.02 } : {}}
              whileTap={isValid ? { scale: 0.98 } : {}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              </svg>
              <span className="relative">Live Session</span>
            </motion.button>

            <motion.button
              onClick={() => onStartDemo(DEMO_CONTEXT)}
              className="flex-1 relative group flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-base text-white/60 bg-white/[0.04] border border-white/[0.07] hover:text-white hover:bg-emerald-500/10 hover:border-emerald-500/25 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="relative">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span className="relative">Run Demo</span>
            </motion.button>

            <motion.button
              onClick={onStartVersus}
              className="flex-1 relative group flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-base text-white/60 bg-white/[0.04] border border-white/[0.07] hover:text-white hover:bg-rose-500/10 hover:border-rose-500/25 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="relative">Two Player</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.p
          className="text-center text-white/15 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Zero data stored · Everything runs in your browser
        </motion.p>
      </motion.div>
    </div>
  )
}
