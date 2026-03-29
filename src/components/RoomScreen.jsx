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

  const inputClass = 'w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-white/90 text-sm placeholder:text-white/15 focus:outline-none focus:border-[#00f0ff]/40 focus:bg-white/[0.05] transition-all duration-300'

  if (!roomCode) {
    return (
      <div className="min-h-screen bg-[#06060b] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
        <div className="absolute inset-0 bg-radial-glow" />

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

          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
            Two-Player <span className="text-[#00f0ff]">Mode</span>
          </h1>
          <p className="text-white/30 text-sm mb-8">
            Negotiate against another person. Each gets their own AI agent.
          </p>

          {(roomError || !isConnected) && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-[#ff3b5c]/[0.08] border border-[#ff3b5c]/20">
              <p className="text-[#ff3b5c] text-xs">
                {roomError || 'Connecting to server...'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              onClick={handleCreate}
              disabled={!isConnected}
              className="glass-card rounded-2xl p-6 text-left hover:border-[#00f0ff]/20 transition-all group disabled:opacity-40"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center mb-4 group-hover:bg-[#00f0ff]/15 transition-all">
                <span className="text-lg">+</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Create Room</h3>
              <p className="text-white/25 text-xs">You&apos;re the negotiator</p>
            </motion.button>

            <div className="glass-card rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center mb-4">
                <span className="text-lg">→</span>
              </div>
              <h3 className="text-white font-semibold mb-3">Join Room</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="CODE"
                  maxLength={6}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono tracking-[0.2em] text-center uppercase focus:outline-none focus:border-[#00ff88]/40 transition-all"
                />
                <button
                  onClick={handleJoin}
                  disabled={!isConnected || joinCode.length < 4}
                  className="px-3 py-2 rounded-lg bg-[#00ff88]/10 text-[#00ff88] text-sm font-semibold border border-[#00ff88]/20 hover:bg-[#00ff88]/20 transition-all disabled:opacity-30"
                >
                  Join
                </button>
              </div>
              {joinError && (
                <p className="text-[#ff3b5c] text-[10px] mt-2">{joinError}</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#06060b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      <div className="absolute inset-0 bg-radial-glow" />

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

        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Room Code</p>
              <p className="text-3xl font-extrabold font-mono tracking-[0.3em] text-[#00f0ff]">
                {roomCode}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="text-white/20 text-[9px] uppercase tracking-wider">
                  You: {role === 'host' ? 'Negotiator' : 'Counter-party'}
                </span>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(roomCode)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/40 text-[10px] font-bold hover:bg-white/[0.08] hover:text-white/60 transition-all"
              >
                Copy Code
              </button>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${peerConnected ? 'bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.5)]' : 'bg-white/15 animate-pulse'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${peerConnected ? 'text-[#00ff88]/70' : 'text-white/25'}`}>
                  {peerConnected ? 'Opponent Connected' : 'Waiting for opponent...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {peerLeft && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-[#ff3b5c]/[0.08] border border-[#ff3b5c]/20">
            <p className="text-[#ff3b5c] text-xs">Opponent disconnected.</p>
          </div>
        )}

        <AnimatePresence>
          {!submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <h2 className="text-white/60 text-xs font-bold tracking-[0.15em] uppercase">
                  Your Private Briefing
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                <span className="text-white/15 text-[9px]">Pre-filled &bull; edit if needed</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-white/30 text-[10px] uppercase tracking-widest mb-1.5">Type</label>
                  <select value={context.negotiationType} onChange={handleChange('negotiationType')} className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="" className="bg-[#0d0d15]">Select...</option>
                    {NEGOTIATION_TYPES.map((t) => <option key={t} value={t} className="bg-[#0d0d15]">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-white/30 text-[10px] uppercase tracking-widest mb-1.5">Your Goal</label>
                  <input type="text" value={context.userGoal} onChange={handleChange('userGoal')} placeholder="What are you trying to achieve?" className={inputClass} />
                </div>
                <div>
                  <label className="block text-white/30 text-[10px] uppercase tracking-widest mb-1.5">Opposing Party</label>
                  <input type="text" value={context.otherPartyRole} onChange={handleChange('otherPartyRole')} placeholder="Who are you negotiating with?" className={inputClass} />
                </div>
                <div>
                  <label className="block text-white/30 text-[10px] uppercase tracking-widest mb-1.5">Key Facts</label>
                  <textarea value={context.keyFacts} onChange={handleChange('keyFacts')} placeholder="Your leverage and data points" rows={2} className={`${inputClass} resize-none`} />
                </div>
                <div>
                  <label className="block text-white/30 text-[10px] uppercase tracking-widest mb-1.5">BATNA</label>
                  <input type="text" value={context.batna} onChange={handleChange('batna')} placeholder="Your best alternative" className={inputClass} />
                </div>
              </div>

              <motion.button
                onClick={handleSubmitContext}
                disabled={!isFormValid}
                className={`w-full mt-5 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  isFormValid
                    ? 'bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#00f0ff]/20'
                    : 'bg-white/[0.02] border border-white/[0.05] text-white/15 cursor-not-allowed'
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
              className="glass-card rounded-2xl p-8 text-center"
            >
              <motion.div
                className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center mx-auto mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xl">✓</span>
              </motion.div>
              <p className="text-white/50 text-sm">You&apos;re ready.</p>
              <p className="text-white/20 text-xs mt-1">
                {peerConnected
                  ? 'Waiting for opponent to submit their briefing...'
                  : 'Waiting for opponent to join and submit briefing...'}
              </p>
              <p className="text-white/10 text-[10px] mt-3">Conversation starts automatically when both are ready</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
