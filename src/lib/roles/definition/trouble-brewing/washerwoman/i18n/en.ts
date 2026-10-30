const en = {
  name: 'Washerwoman',
  description:
    'On Night 1, learn 2 players and a Townsfolk character. One registers as that character.',
  quote: 'Even the dirtiest linens leave traces of who wore them.',
  lines: [
    {
      type: 'NIGHT',
      text: 'On Night 1, learn 2 candidates and a Townsfolk character one registers as.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // NightAction UI
  washerwomanInfo: 'Your Information',
  mustIncludeTownsfolk:
    'Include a candidate who can register as the shown character.',
  oneOfTheseIsTheTownsfolk:
    'One of these players is a Townsfolk. Remember who they are!',
  noTownsfolkInGame: 'No Townsfolk',
  noTownsfolkMessage:
    'There are no other Townsfolk in this game. This is valuable information!',
  confirmNoTownsfolk: 'Show to Player',
  showNoTownsfolk: 'Show "No Townsfolk" instead',

  // History
  history: {
    discoveredTownsfolk: '{player} was shown {player1} or {player2}: {role}',
    noTownsfolk: '{player} learned there are no other Townsfolk in this game',
  },
} as const

export default en
