const en = {
  name: 'Investigator',
  description:
    'On Night 1, learn 2 players and a Minion character. One registers as that character.',
  quote: 'Follow the money. Follow the whispers. Follow the fear.',
  lines: [
    {
      type: 'NIGHT',
      text: 'On Night 1, learn 2 candidates and a Minion character one registers as.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // NightAction UI
  investigatorInfo: 'Your Information',
  mustIncludeMinion:
    'Include a candidate who can register as the shown character.',
  oneOfTheseIsTheMinion:
    'One of these players is a Minion. Remember who they are!',
  noMinionsInGame: 'No Minions',
  noMinionsMessage:
    'There are no Minions in this game. This is valuable information!',
  confirmNoMinions: 'Show to Player',
  showNoMinions: 'Show "No Minions" instead',

  // History
  history: {
    discoveredMinion: '{player} was shown {player1} or {player2}: {role}',
    noMinions: '{player} learned there are no Minions in this game',
  },
} as const

export default en
