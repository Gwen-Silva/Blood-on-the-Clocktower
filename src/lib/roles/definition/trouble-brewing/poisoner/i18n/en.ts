const en = {
  name: 'Poisoner',
  description:
    'Each night, choose a player: they are poisoned tonight and tomorrow day.',
  quote: 'A little patience, a little powder. No one ever suspects the cook.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Each night, choose a player to poison until the next dusk.',
    },
    {
      type: 'CAVEAT',
      text: 'Poisoned players have no ability, but may receive arbitrary true or false information without knowing why.',
    },
    { type: 'TEAM', text: 'With 7+ players, you learn your evil teammates.' },
    {
      type: 'WIN',
      text: 'Evil normally wins with 2 players alive, including a Demon.',
    },
  ],

  // NightAction UI
  info: 'Choose a Target',
  selectPlayerToPoison:
    'Wake {player} and record their target for tonight and tomorrow day.',

  // First night: evil team
  evilTeamTitle: 'Your Evil Team',
  evilTeamDescription: 'These are your fellow evil players.',

  // History
  history: {
    poisonedPlayer: '{player} poisoned {target}',
    shownEvilTeam: '{player} was shown the evil team',
  },
} as const

export default en
