const en = {
  name: 'Monk',
  description:
    'Each night except the first, choose another player: they are safe from the Demon tonight.',
  quote: 'In silence I keep vigil, so that others may wake.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Each night except the first, choose another player: they are safe from the Demon tonight.',
    },
    { type: 'PROTECT', text: 'You cannot protect yourself.' },
    {
      type: 'INFO',
      text: 'You are not woken on the first night, as the Demon does not attack.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // NightAction UI
  info: 'Choose a Player',
  selectPlayerToProtect:
    'Wake {player} and ask them to point to a player to protect from the Demon.',
  protectedForTheNight: 'is protected for the night.',

  // History
  history: {
    protectedPlayer: '{player} protected {target} for the night',
  },
} as const

export default en
