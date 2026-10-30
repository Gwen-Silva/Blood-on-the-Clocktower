const en = {
  name: 'Virgin',
  description:
    'The first time you are nominated, a nominator registering as Townsfolk is executed immediately.',
  quote: 'Innocence is the sharpest blade. But it only cuts once.',
  lines: [
    {
      type: 'PASSIVE',
      text: 'The first time you are nominated, if the nominator registers as Townsfolk, they are executed immediately.',
    },
    {
      type: 'INFO',
      text: 'If the nominator does not register as Townsfolk, nothing happens and the nomination continues.',
    },
    {
      type: 'CAVEAT',
      text: 'This ability is spent after the first nomination, regardless of the result.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // History
  history: {
    townsfolkExecuted: '{nominator} nominated the Virgin and was executed!',
    lostPurity: "{nominator} nominated the Virgin: the Virgin's power is spent",
  },
} as const

export default en
