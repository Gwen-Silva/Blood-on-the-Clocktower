const en = {
  name: 'Baron',
  description: 'Setup adds 2 Outsiders in place of 2 Townsfolk.',
  quote: 'Corruption starts at the top. It trickles down from there.',
  lines: [
    {
      type: 'SETUP',
      text: 'Two extra Outsiders are added to the game, replacing Townsfolk.',
    },
    { type: 'ADVICE', text: 'More Outsiders means more chaos.' },
    { type: 'TEAM', text: 'With 7+ players, you learn your evil teammates.' },
    {
      type: 'WIN',
      text: 'Evil normally wins with 2 players alive, including a Demon.',
    },
  ],

  // First night: evil team
  evilTeamTitle: 'Your Evil Team',
  evilTeamDescription: 'These are your fellow evil players.',

  // History
  history: {
    shownEvilTeam: '{player} was shown the evil team',
  },
} as const

export default en
