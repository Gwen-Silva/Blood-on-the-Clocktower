const en = {
  name: 'Empath',
  description:
    'Each night, learn how many of your 2 nearest living neighbours register as evil.',
  quote: 'I feel the weight of their sins, even when they smile.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Each night, you learn how many of your alive neighbors are evil.',
    },
    {
      type: 'INFO',
      text: 'If a neighbour dies, count the next living player in that direction.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // NightAction UI
  info: "Empath's Information",
  evilNeighborsCount: 'Evil neighbors among your alive neighbors:',
  evilNeighborsExplanation:
    'This is the number of evil players sitting immediately next to you among alive players.',

  // History
  history: {
    sawEvilNeighbors:
      '{player} learned that {count} of their neighbors are evil',
  },
} as const

export default en
