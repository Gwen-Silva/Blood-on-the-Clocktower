const en = {
  name: 'Fortune Teller',
  description:
    'Each night, choose 2 players: learn if either registers as a Demon. One good player also registers as a Demon to you.',
  quote: 'Every vision is true. Not every vision is honest.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Each night, choose 2 players: you learn whether either of them is the Demon.',
    },
    {
      type: 'CAVEAT',
      text: 'One good player has been chosen to always register as a Demon to you.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // SetupAction UI
  redHerringSetupTitle: 'Red Herring Setup',

  // NightAction UI
  fortuneTellerInfo: 'Your Vision',
  selectTwoPlayersToCheck:
    'Wake {player} and ask them to point to 2 players to check for Demons.',
  selectRedHerring: 'Assign Red Herring',
  redHerringInfo:
    'Select a good player that will register as a Demon for this Fortune Teller.',
  selectGoodPlayerAsRedHerring: 'Select a good player as the Red Herring',
  selectRandomRedHerring: 'Random',
  yesOneIsDemon: 'YES',
  noNeitherIsDemon: 'NO',
  fortuneTellerDemonDetected: 'Result: yes',
  fortuneTellerNoDemon: 'Result: no',

  // History
  history: {
    sawDemon: '{player} checked {player1} and {player2}: YES',
    sawNoDemon: '{player} checked {player1} and {player2}: NO',
    redHerringAssigned:
      '{redHerring} was assigned as the Red Herring for {player}',
  },
} as const

export default en
