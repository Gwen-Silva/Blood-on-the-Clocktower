const en = {
  name: 'Butler',
  description:
    'Each night, choose another player as your master. Tomorrow you may vote only if they are also voting.',
  quote: 'I serve at the pleasure of my master. They say when I speak.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Each night, choose a player to become your master for the day.',
    },
    {
      type: 'CAVEAT',
      text: 'You may only vote on executions if your master votes too.',
    },
    {
      type: 'ADVICE',
      text: 'Even if your master votes, you may choose not to vote.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // NightAction UI
  info: 'Choose Your Master',
  selectPlayerAsMaster: 'Wake {player} and record another player as master.',
  masterLabel: 'Master: {player}',
  voteRestriction: 'May only vote if their master votes',

  // History
  history: {
    choseMaster: '{player} chose {target} as their master',
  },
} as const

export default en
