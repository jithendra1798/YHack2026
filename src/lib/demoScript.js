export const DEMO_CONTEXT = {
  negotiationType: 'Rent Renewal',
  userGoal:
    'Keep rent at current $2,400 or negotiate maximum $100 increase. Current lease expires in 30 days.',
  otherPartyRole: 'Landlord / Property Manager',
  keyFacts:
    'Been a tenant for 3 years with perfect payment history. Comparable units in the neighborhood average $2,100-$2,300. Building has 15% vacancy rate. No major upgrades have been made to the unit.',
  batna: 'Can move to a comparable unit at $2,150/month found on Zillow, 0.3 miles away.'
}

export const DEMO_SCRIPT = [
  {
    speaker: 'them',
    text: 'Thanks for coming in to discuss your lease renewal. So as you know, the market has shifted quite a bit. We\'ve done a comprehensive market analysis and most comparable units in this area are now going for around thirty-two hundred a month. We think a new rate of three thousand even is actually very generous.',
    delay: 2000
  },
  {
    speaker: 'you',
    text: "I appreciate you taking the time to meet. I have to be honest, that number caught me off guard. I've done my own research and I'm seeing a different picture. Can you share which comparables you used?",
    delay: 3000
  },
  {
    speaker: 'them',
    text: "Well, I don't have the exact list in front of me, but trust me, we use a professional service. And honestly, we need to lock this in by end of week because we already have two other applicants interested in this unit if you decide not to renew.",
    delay: 3000
  },
  {
    speaker: 'you',
    text: "I understand you have a process. I've been here three years with perfect payment history and zero complaints. I've also compiled data from Zillow and Apartments dot com showing the median for comparable units within half a mile is twenty-one fifty. I'd like to understand the gap between your number and what the market data shows.",
    delay: 3000
  },
  {
    speaker: 'them',
    text: "Look, I hear you, but those sites don't account for the quality of this building. We just renovated the lobby and the gym. And between you and me, the owner is pushing me to get market rate on every unit. My hands are tied. Three thousand is the lowest I can go.",
    delay: 3000
  },
  {
    speaker: 'you',
    text: "I respect that you have constraints. But I should mention that my unit hasn't received any upgrades — those renovations were in common areas. And I've noticed the building has quite a few vacancies right now. Turning over a unit costs roughly two to three months of lost rent plus renovation costs. Keeping a reliable long-term tenant has real value. I'm comfortable at twenty-four fifty.",
    delay: 3000
  },
  {
    speaker: 'them',
    text: 'You make a fair point about the turnover costs. I... let me think about this. What if we met somewhere in the middle — say twenty-six hundred?',
    delay: 3000
  },
  {
    speaker: 'you',
    text: "I appreciate you working with me on this. How about twenty-five hundred with a two-year lease? That gives you guaranteed occupancy and revenue predictability, and gives me stability. Win-win.",
    delay: 3000
  }
]
