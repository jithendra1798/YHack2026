import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NEGOTIATION_TYPES = [
  'Salary Negotiation',
  'Rent Renewal',
  'Medical Bill',
  'Contract Negotiation',
  'Car Purchase',
  'Freelance Rate',
  'Other'
]

const HOST_PRESETS = {
  negotiationType: 'Rent Renewal',
  userGoal: 'Keep rent at $2,400 or max $100 increase',
  otherPartyRole: 'Landlord / Property Manager',
  keyFacts: '3 years perfect payment. Comparable units avg $2,100-$2,300. Building 15% vacancy.',
  batna: 'Comparable unit at $2,150/month on Zillow nearby'
}

const GUEST_PRESETS = {
  negotiationType: 'Rent Renewal',
  userGoal: 'Increase rent to $3,000 to match market rates',
  otherPartyRole: 'Tenant',
  keyFacts: 'Market rates have risen 20%. Building renovated lobby and gym. Owner wants market rate.',
  batna: 'Can find new tenant at $3,200 market rate'
}

export default function RoomScreen({ room, onReady, onBack }) {
  const {
    roomCode,
    isConnected,
    peerConnected,
    bothReady,
    role,
    error: roomError,
    peerLeft,
    createRoom,
    joinRoom,
    playerReady
  } = room

  const [joinCode, setJoinCode] = useState('')
  const [joinError, setJoinError] = useState(null)
  const [context, setContext] = useState({
    negotiationType: '',
    userGoal: '',
    otherPartyRole: '',
    keyFacts: '',
    batna: ''
  })
  const [submitted, setSubmitted] = useState(false)

  // Pre-fill context based on role
  useEffect(() => {
    if (role === 'host') {
      setContext(HOST_PRESETS)
    } else if (role === 'guest') {
      setContext(GUEST_PRESETS)
    }
  }, [role])

  // Auto-start when both ready
  useEffect(() => {
    if (bothReady && submitted) {
      onReady(context)
    }
  }, [bothReady]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async () => {
    try {
      await createRoom()
    } catch (e) {
      console.error(e)
    }
  }

  const handleJoin = async () => {
    if (joinCode.length < 4) {
      setJoinError('Enter the full room code')
      return
    }
    try {
      setJoinError(null)
      await joinRoom(joinCode)
    } catch (e) {
      setJoinError(e.message)
    }
  }

  const handleSubmitContext = () => {
    setSubmitted(true)
    playerReady()
  }

  const handleChange = (field) => (e) => {
    setContext((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const isFormValid = context.negotiationType && context.userGoal

  const inputClass = 'w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3.5 text-white/90 text-[13px] placeholder:text-white/20 focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-indigo-500/20 transition-all duration-300'

  if (!roomCode) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-dots opacity-60" />

        <motion.div
          className="w-full max-w-lg relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/30 hover:text-white/60 text-sm mb-8 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h1 className="font-brand text-3xl font-bold text-white tracking-tight mb-1">
            Two-Player <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Mode</span>
          </h1>
          <p className="text-white/40 text-sm mb-8">
            Negotiate against another person. Each gets their own AI agent.
          </p>

          {(roomError || !isConnected) && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-rose-500/[0.08] border border-rose-500/20">
              <p className="text-rose-400 text-xs">
                {roomError || 'Connecting to server...'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">
            <motion.button
              onClick={handleCreate}
              disabled={!isConnected}
              className="glass-card rounded-2xl p-7 text-left hover:border-indigo-500/25 transition-all group disabled:opacity-40"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 flex items-center justify-center mb-4 group-hover:from-indigo-500/25 group-hover:to-violet-500/25 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400"><path d="M12 5v14M5 12h14" /></svg>
              </div>
              <h3 className="text-white font-semibold mb-1">Create Room</h3>
              <p className="text-white/30 text-xs">You&apos;re the negotiator</p>
            </motion.button>

            <div className="glass-card rounded-2xl p-7">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" /></svg>
              </div>
              <h3 className="text-white font-semibold mb-3">Join Room</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="CODE"
                  maxLength={6}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono tracking-[0.2em] text-center uppercase focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
                <button
                  onClick={handleJoin}
                  disabled={!isConnected || joinCode.length < 4}
                  className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-semibold border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-30"
                >
                  Join
                </button>
              </div>
              {joinError && (
                <p className="text-rose-400 text-[11px] mt-2">{joinError}</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-dots opacity-60" />

      <motion.div
        className="w-full max-w-lg relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/30 hover:text-white/60 text-sm mb-6 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Leave Room
        </button>

        <div className="glass-card rounded-2xl p-7 mb-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-1.5">Room Code</p>
              <p className="text-3xl font-bold font-mono tracking-[0.3em] bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                {roomCode}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-[10px] font-medium">
                  You: {role === 'host' ? 'Negotiator' : 'Counter-party'}
                </span>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(roomCode)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/40 text-[11px] font-medium hover:bg-white/[0.08] hover:text-white/60 transition-all border border-white/[0.06]"
              >
                Copy Code
              </button>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${peerConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-white/15 animate-pulse'}`} />
                <span className={`text-[10px] font-medium ${peerConnected ? 'text-emerald-400/70' : 'text-white/25'}`}>
                  {peerConnected ? 'Opponent Connected' : 'Waiting for opponent...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {peerLeft && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-rose-500/[0.08] border border-rose-500/20">
            <p className="text-rose-400 text-xs">Opponent disconnected.</p>
          </div>
        )}

        <AnimatePresence>
          {!submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/15 to-violet-500/15 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <h2 className="text-white/60 text-sm font-semibold">Your Private Briefing</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
                <span className="text-white/20 text-[10px]">Pre-filled · edit if needed</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/35 text-xs font-medium mb-1.5">Type</label>
                  <select value={context.negotiationType} onChange={handleChange('negotiationType')} className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="" className="bg-[#111113]">Select...</option>
                    {NEGOTIATION_TYPES.map((t) => <option key={t} value={t} className="bg-[#111113]">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-white/35 text-xs font-medium mb-1.5">Your Goal</label>
                  <input type="text" value={context.userGoal} onChange={handleChange('userGoal')} placeholder="What are you trying to achieve?" className={inputClass} />
                </div>
                <div>
                  <label className="block text-white/35 text-xs font-medium mb-1.5">Opposing Party</label>
                  <input type="text" value={context.otherPartyRole} onChange={handleChange('otherPartyRole')} placeholder="Who are you negotiating with?" className={inputClass} />
                </div>
                <div>
                  <label className="block text-white/35 text-xs font-medium mb-1.5">Key Facts</label>
                  <textarea value={context.keyFacts} onChange={handleChange('keyFacts')} placeholder="Your leverage and data points" rows={2} className={`${inputClass} resize-none`} />
                </div>
                <div>
                  <label className="block text-white/35 text-xs font-medium mb-1.5">BATNA</label>
                  <input type="text" value={context.batna} onChange={handleChange('batna')} placeholder="Your best alternative" className={inputClass} />
                </div>
              </div>

              <motion.button
                onClick={handleSubmitContext}
                disabled={!isFormValid}
                className={`w-full mt-7 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  isFormValid
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:brightness-110'
                    : 'bg-white/[0.04] border border-white/[0.06] text-white/20 cursor-not-allowed'
                }`}
                whileHover={isFormValid ? { scale: 1.01 } : {}}
                whileTap={isFormValid ? { scale: 0.99 } : {}}
              >
                {peerConnected ? 'Ready — Start When Opponent Ready' : 'Ready — Waiting for Opponent to Join'}
              </motion.button>
            </motion.div>
          )}

          {submitted && !bothReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-10 text-center"
            >
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 flex items-center justify-center mx-auto mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-400"><polyline points="20 6 9 17 4 12" /></svg>
              </motion.div>
              <p className="text-white/60 text-sm font-medium">You&apos;re ready.</p>
              <p className="text-white/25 text-xs mt-1">
                {peerConnected
                  ? 'Waiting for opponent to submit their briefing...'
                  : 'Waiting for opponent to join and submit briefing...'}
              </p>
              <p className="text-white/15 text-[11px] mt-3">Conversation starts automatically when both are ready</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
