const en = {
  name: 'Undertaker',
  description:
    'Each night except the first, learn the character of the player who died by execution today.',
  quote: 'The dead always tell the truth. You just have to know where to look.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Each night except the first, learn the character of the player who died by execution today.',
    },
    {
      type: 'INFO',
      text: 'If nobody died by execution, there is no character to learn.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // NightAction UI
  undertakerInfo: 'The Executed Role',
  executedPlayerRole: 'The player who died by execution was…',
  noExecutionToday: 'Nobody died by execution today.',

  // History
  history: {
    sawExecutedRole: '{player} learned that the executed player was the {role}',
    noExecution: '{player} learned nobody died by execution',
  },
} as const

export default en
