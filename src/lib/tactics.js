export const TACTICS = {
  ANCHORING: {
    name: 'Anchoring',
    description: 'Setting a reference point to skew your perception of what\'s reasonable.',
    icon: '⚓',
    color: '#ff3b5c',
    borderColor: 'rgba(255, 59, 92, 0.6)'
  },
  'FALSE URGENCY': {
    name: 'False Urgency',
    description: 'Creating artificial time pressure to rush your decision.',
    icon: '⏰',
    color: '#ff6b35',
    borderColor: 'rgba(255, 107, 53, 0.6)'
  },
  'LOWBALL / HIGHBALL': {
    name: 'Lowball / Highball',
    description: 'Making an extreme opening to shift the negotiation range.',
    icon: '📉',
    color: '#ff3b5c',
    borderColor: 'rgba(255, 59, 92, 0.6)'
  },
  'GOOD COP BAD COP': {
    name: 'Good Cop / Bad Cop',
    description: 'Alternating between pressure and sympathy to manipulate you.',
    icon: '🎭',
    color: '#ff6b35',
    borderColor: 'rgba(255, 107, 53, 0.6)'
  },
  'GUILT TRIP': {
    name: 'Guilt Trip',
    description: 'Using emotional manipulation to make you feel obligated.',
    icon: '😢',
    color: '#ffaa00',
    borderColor: 'rgba(255, 170, 0, 0.6)'
  },
  'APPEAL TO AUTHORITY': {
    name: 'Appeal to Authority',
    description: 'Hiding behind "company policy" or higher authority to avoid negotiating.',
    icon: '👔',
    color: '#ff6b35',
    borderColor: 'rgba(255, 107, 53, 0.6)'
  },
  'SILENCE PRESSURE': {
    name: 'Silence Pressure',
    description: 'Using deliberate uncomfortable silence to make you concede.',
    icon: '🤫',
    color: '#ffaa00',
    borderColor: 'rgba(255, 170, 0, 0.6)'
  },
  NIBBLING: {
    name: 'Nibbling',
    description: 'Adding small extra asks after the main agreement is reached.',
    icon: '🐁',
    color: '#ffaa00',
    borderColor: 'rgba(255, 170, 0, 0.6)'
  },
  FLINCH: {
    name: 'Flinch',
    description: 'Exaggerated negative reaction to your proposal to make you doubt it.',
    icon: '😱',
    color: '#ff6b35',
    borderColor: 'rgba(255, 107, 53, 0.6)'
  },
  'TAKE IT OR LEAVE IT': {
    name: 'Take It or Leave It',
    description: 'Presenting a false binary to eliminate negotiation room.',
    icon: '🚪',
    color: '#ff3b5c',
    borderColor: 'rgba(255, 59, 92, 0.6)'
  },
  'SOCIAL PROOF': {
    name: 'Social Proof',
    description: 'Claiming "everyone else" agreed to pressure you into compliance.',
    icon: '👥',
    color: '#ffaa00',
    borderColor: 'rgba(255, 170, 0, 0.6)'
  },
  'MOVING GOALPOSTS': {
    name: 'Moving Goalposts',
    description: 'Changing criteria after you\'ve already made concessions.',
    icon: '🥅',
    color: '#ff3b5c',
    borderColor: 'rgba(255, 59, 92, 0.6)'
  },
  'FALSE SCARCITY': {
    name: 'False Scarcity',
    description: 'Creating artificial scarcity to pressure your decision.',
    icon: '⚠️',
    color: '#ff6b35',
    borderColor: 'rgba(255, 107, 53, 0.6)'
  }
}

export const getSeverityColor = (severity) => {
  switch (severity) {
    case 'high':
      return '#fb7185'
    case 'moderate':
      return '#fb923c'
    case 'low':
      return '#fbbf24'
    default:
      return '#fb923c'
  }
}

export const getTacticMeta = (tacticName) => {
  const key = tacticName?.toUpperCase()
  return TACTICS[key] || {
    name: tacticName,
    description: 'A negotiation tactic detected in the conversation.',
    icon: '⚠️',
    color: '#ff6b35',
    borderColor: 'rgba(255, 107, 53, 0.6)'
  }
}
