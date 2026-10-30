const en = {
  name: 'Librarian',
  description:
    'On Night 1, learn 2 players and an Outsider character one registers as, or that no Outsiders are in play.',
  quote: 'Every name has a story. Some stories are warnings.',
  lines: [
    {
      type: 'FIRST_NIGHT',
      text: 'Learn 2 candidates and an Outsider character one registers as, or learn that zero Outsiders are in play.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // NightAction UI
  librarianInfo: 'Your Information',
  mustIncludeOutsider:
    'Include a candidate who can register as the shown character.',
  oneOfTheseIsTheOutsider:
    'One of these players is an Outsider. Remember who they are!',
  noOutsidersInGame: 'No Outsiders',
  noOutsidersMessage: 'Information received: zero Outsiders.',
  confirmNoOutsiders: 'Show to Player',
  showNoOutsiders: 'Show "No Outsiders" instead',

  // History
  history: {
    discoveredOutsider: '{player} was shown {player1} or {player2}: {role}',
    noOutsiders: '{player} learned there are no Outsiders in this game',
  },
} as const

export default en
