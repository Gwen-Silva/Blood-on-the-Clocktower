const en = {
  name: 'Recluse',
  description:
    'You may register as evil, a Minion or a Demon, even while dead. You remain good.',
  quote: 'They avoid me. Perhaps they are right to.',
  lines: [
    {
      type: 'PASSIVE',
      text: 'You may register as evil, a Minion or a Demon, even while dead. You remain good.',
    },
    {
      type: 'CAVEAT',
      text: 'Other roles with the ability to see your role might see a false role instead.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],
} as const

export default en
