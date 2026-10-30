const en = {
  name: 'Ravenkeeper',
  description:
    'If you die at night, choose a player and learn their character as it registers to you.',
  quote: 'My last breath will not be wasted. Someone will be named.',
  lines: [
    {
      type: 'ON_DEATH',
      text: 'If you die at night, you wake to choose any player and learn their role.',
    },
    {
      type: 'INFO',
      text: 'This only works if you die at night, not by execution.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // NightAction UI
  ravenkeeperInfo: 'Choose a Player',
  selectPlayerToSeeRole:
    'Wake {player} and ask them to point to a player to learn their role.',
  playerRoleIs: 'Their role is...',

  // History
  history: {
    sawRole: "{player} chose to see {target}'s role: {role}",
  },
} as const

export default en
