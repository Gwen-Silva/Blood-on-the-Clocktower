const en = {
  name: 'Slayer',
  description:
    'Once per game by day, publicly choose a player: if they register as the Demon, they die.',
  quote: 'One shot. Make it count.',
  lines: [
    { type: 'DAY', text: 'During the day, you can publicly shoot one player.' },
    {
      type: 'INFO',
      text: 'If they register as a Demon, they die. Otherwise, nothing happens.',
    },
    { type: 'CAVEAT', text: 'You only have one shot.' },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // History
  history: {
    targetDied: '{slayer} shot {target}: the target died!',
    missed: '{slayer} shot {target}: nothing happened',
  },
} as const

export default en
