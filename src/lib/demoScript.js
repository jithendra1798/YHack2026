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
    text: "Let's talk about your renewal. Market's moved — similar units are going for thirty-two hundred. Three thousand flat is a fair deal.",
    delay: 1500
  },
  {
    speaker: 'you',
    text: "That's a big jump. I've done some research and I'm seeing very different numbers. What comparables are you using?",
    delay: 2500
  },
  {
    speaker: 'them',
    text: "We use a professional service — trust me, the data's solid. Also, I need an answer by Friday. Two other people want this unit.",
    delay: 2500
  },
  {
    speaker: 'you',
    text: "I hear you. But I've been here three years, never missed a payment. Zillow and Apartments dot com show the median at twenty-one fifty. That's a big gap.",
    delay: 2500
  },
  {
    speaker: 'them',
    text: "Those sites don't reflect building quality. We renovated the lobby and gym. Plus the owner wants market rate. Three thousand is my floor.",
    delay: 2500
  },
  {
    speaker: 'you',
    text: "The renovations were common areas — my unit's the same. And with your vacancy rate, turning over a unit costs two to three months of rent. I'm a sure thing at twenty-four fifty.",
    delay: 2500
  },
  {
    speaker: 'them',
    text: "Fair point on turnover. How about we meet in the middle — twenty-six hundred?",
    delay: 2500
  },
  {
    speaker: 'you',
    text: "Twenty-five hundred, two-year lease. You get guaranteed income, I get stability. Win-win.",
    delay: 2500
  }
]
