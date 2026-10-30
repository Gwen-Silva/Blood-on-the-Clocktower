const en = {
  name: 'Scarlet Woman',
  description:
    'If the Demon dies with at least 5 players alive, you become the Demon. Count the dying Demon; not Travellers.',
  quote: 'When the throne falls, I will already be wearing the crown.',
  lines: [
    {
      type: 'PASSIVE',
      text: 'If the Demon dies and 5+ players are alive, you become the new Demon.',
    },
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
    becameDemon: '{player} became the {role}',
    shownEvilTeam: '{player} was shown the evil team',
  },
} as const

export default en
