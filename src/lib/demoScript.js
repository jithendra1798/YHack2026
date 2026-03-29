export const DEMO_CONTEXT = {
  negotiationType: 'Rent Renewal',
  userGoal:
    'Keep rent at current $2,400 or negotiate maximum $100 increase. Current lease expires in 30 days.',
  otherPartyRole: 'Landlord / Property Manager',
  keyFacts:
    'Been a tenant for 3 years with perfect payment history. Comparable units in the neighborhood average $2,100-$2,300. Building has 15% vacancy rate. No major upgrades have been made to the unit.',
  batna: 'Can move to a comparable unit at $2,150/month found on Zillow, 0.3 miles away.'
}

// Demo structure:
// - speaker: 'narrator' = floating cloud popup (not in transcript), disappears after TTS
// - speaker: 'you'|'them' = conversation entry in transcript
// - inject: pre-seeded analysis data (bypasses Claude for 100% reliability)
// - delay: pause BEFORE this item plays (ms)
//
// Timing target: ~60 seconds total (±5s)
// Intro pitch: ~15s | Negotiation: ~30s | Outro pitch: ~15s

export const DEMO_SCRIPT = [
  // ═══════════════════════════════════════
  // INTRO PITCH (~15s) — clouds explain what PARLEY is
  // ═══════════════════════════════════════
  {
    speaker: 'narrator',
    text: 'PARLEY. Your real-time AI negotiation copilot.',
    speakText: 'This is PARLEY. Your real-time AI negotiation copilot.',
    delay: 600
  },
  {
    speaker: 'narrator',
    text: 'Detects manipulation tactics · Coaches what to say · Tracks power dynamics',
    speakText: 'It detects manipulation tactics, coaches you what to say, and tracks who has the upper hand. All in real time.',
    delay: 300
  },
  {
    speaker: 'narrator',
    text: 'Demo: Rent renewal. Tenant at $2,400/mo, Landlord pushing $3,200/mo.',
    speakText: 'Watch this rent negotiation. Tenant pays twenty-four hundred. Landlord wants thirty-two hundred.',
    delay: 300
  },

  // ═══════════════════════════════════════
  // NEGOTIATION (~30s) — short punchy lines, pre-seeded analysis
  // Counter-moves foreshadow the next "you" line = WOW factor
  // ═══════════════════════════════════════
  {
    speaker: 'them',
    text: "Your new rate is thirty-two hundred. Market rents have gone up significantly.",
    delay: 1200,
    inject: {
      tactics: [
        {
          tactic_name: 'ANCHORING',
          description: 'Extreme opening to shift your expectations',
          evidence: 'Your new rate is thirty-two hundred',
          confidence: 94,
          severity: 'high'
        }
      ],
      counterMoves: [
        {
          say_this: 'Ask what data supports that price',
          strategy: 'Challenge the anchor with your own research',
          tone: 'curious'
        },
        {
          say_this: 'Name your comparable market rate',
          strategy: 'Counter-anchor with real data',
          tone: 'firm'
        }
      ],
      powerScore: 36,
      powerReasoning: 'They set a high anchor',
      situationRead: 'Aggressive opening, stay calm and challenge it'
    }
  },
  {
    speaker: 'you',
    text: "That's eight hundred more. What data backs that up?",
    delay: 800
  },
  {
    speaker: 'them',
    text: "Professional market analysis. I need your answer by Friday, two applicants are already waiting.",
    delay: 600,
    inject: {
      tactics: [
        {
          tactic_name: 'FALSE URGENCY',
          description: 'Friday deadline creates false time pressure',
          evidence: 'I need your answer by Friday, two applicants are already waiting',
          confidence: 96,
          severity: 'high'
        },
        {
          tactic_name: 'APPEAL TO AUTHORITY',
          description: 'Professional analysis to legitimize inflated price',
          evidence: 'Professional market analysis',
          confidence: 89,
          severity: 'moderate'
        }
      ],
      counterMoves: [
        {
          say_this: 'Present your own comparable data',
          strategy: 'Counter their authority with real evidence',
          tone: 'firm'
        }
      ],
      powerScore: 28,
      powerReasoning: 'Multiple pressure tactics stacked',
      situationRead: 'They are stacking pressure, hold your ground'
    }
  },
  {
    speaker: 'you',
    text: "Comparable units nearby go for twenty-one to twenty-three hundred.",
    delay: 800
  },
  {
    speaker: 'them',
    text: "Look, the owner won't go below three thousand. My hands are tied.",
    delay: 600,
    inject: {
      tactics: [
        {
          tactic_name: 'GOOD COP BAD COP',
          description: 'Blaming invisible owner while appearing sympathetic',
          evidence: 'The owner won\'t go below three thousand, my hands are tied',
          confidence: 91,
          severity: 'moderate'
        }
      ],
      counterMoves: [
        {
          say_this: 'Mention your track record and their vacancy rate',
          strategy: 'Shift leverage by highlighting their costs',
          tone: 'assertive'
        }
      ],
      powerScore: 47,
      powerReasoning: 'Your data countered their anchor',
      situationRead: 'They are softening, press your advantage'
    }
  },
  {
    speaker: 'you',
    text: "I've been here three years with perfect payments. Your building is fifteen percent vacant.",
    delay: 800
  },
  {
    speaker: 'them',
    text: "Twenty-eight hundred. Final offer, take it or leave it.",
    delay: 600,
    inject: {
      tactics: [
        {
          tactic_name: 'TAKE IT OR LEAVE IT',
          description: 'False ultimatum, they already dropped $400',
          evidence: 'Final offer, take it or leave it',
          confidence: 93,
          severity: 'high'
        }
      ],
      counterMoves: [
        {
          say_this: 'Propose twenty-five fifty with a two-year lease',
          strategy: 'Create a win-win with long-term commitment',
          tone: 'calm'
        }
      ],
      powerScore: 62,
      powerReasoning: 'They dropped $400, you have leverage',
      situationRead: 'They are retreating, make your best offer'
    }
  },
  {
    speaker: 'you',
    text: "Twenty-five fifty with a two-year lease. That's guaranteed income.",
    delay: 800
  },
  {
    speaker: 'them',
    text: "Alright, deal. Twenty-five fifty, two years.",
    delay: 1000,
    inject: {
      tactics: [],
      counterMoves: [
        {
          say_this: 'Get everything in writing immediately',
          strategy: 'Lock in the verbal agreement now',
          tone: 'calm'
        }
      ],
      powerScore: 78,
      powerReasoning: 'Deal closed on your terms',
      situationRead: 'Strong outcome, $650 per month saved'
    }
  },

  // ═══════════════════════════════════════
  // OUTRO PITCH (~15s) — clouds summarize results
  // ═══════════════════════════════════════
  {
    speaker: 'narrator',
    text: '4 tactics detected: Anchoring · False Urgency · Authority Appeal · Good Cop/Bad Cop',
    speakText: 'In under thirty seconds, PARLEY detected four manipulation tactics. Anchoring, false urgency, authority appeal, and good cop bad cop.',
    delay: 1500
  },
  {
    speaker: 'narrator',
    text: '$3,200 down to $2,550. Saved $650/month with real-time AI coaching.',
    speakText: 'Rent dropped from thirty-two hundred to twenty-five fifty. Six hundred fifty dollars saved per month with AI coaching.',
    delay: 300
  },
  {
    speaker: 'narrator',
    text: 'PARLEY. Works for salary, rent, contracts, medical bills. Any negotiation.',
    speakText: 'PARLEY. Real-time AI for any negotiation. Salary, rent, contracts, medical bills.',
    delay: 300
  }
]
