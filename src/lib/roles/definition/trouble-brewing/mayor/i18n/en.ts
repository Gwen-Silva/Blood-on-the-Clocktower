const en = {
  name: 'Mayor',
  description:
    'At dusk, if 3 players live and nobody was executed today, your team wins. At night, someone might die instead of you.',
  quote: 'The town endures because someone must hold the line.',
  lines: [
    {
      type: 'PASSIVE',
      text: 'At dusk, if 3 players live and nobody was executed today, good wins.',
    },
    {
      type: 'PROTECT',
      text: 'If you are targeted by the demon at night, another player might die instead.',
    },
    {
      type: 'WIN',
      text: 'Good normally wins when no Demon remains alive.',
    },
  ],
} as const

export default en
