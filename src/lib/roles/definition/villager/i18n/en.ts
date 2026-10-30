const en = {
  name: 'Villager',
  description: 'Custom character: no ability. Help good find the Demon.',
  quote: 'The strength of the village is in its people. Every voice counts.',
  lines: [
    { type: 'PASSIVE', text: 'You have no special ability.' },
    {
      type: 'ADVICE',
      text: 'Listen, discuss, and use your vote wisely: your judgment is your weapon.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],
} as const

export default en
