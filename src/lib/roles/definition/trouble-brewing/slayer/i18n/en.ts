const en = {
  name: 'Slayer',
  description:
    'Once per game by day, publicly choose a player: if they register as the Demon, they die.',
  quote: 'One shot. Make it count.',
  lines: [
    { type: 'DAY', text: 'During the day, you can publicly shoot one player.' },
    {
      type: 'INFO',
      text: 'If the target does not register as a Demon, nothing happens.',
    },
    {
      type: 'CAVEAT',
      text: 'Your shot is spent even if the target does not die.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // History
  history: {
    targetDied: '{slayer} shot {target}: the target died!',
    missed: '{slayer} shot {target}: nothing happened',
  },
} as const

export default en
