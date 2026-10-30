const es = {
  name: 'Mayordomo',
  description:
    'Cada noche, elige a otro jugador. Mañana solo puedes votar mientras también vote.',
  quote: 'Sirvo a voluntad de mi amo. Él decide cuándo puedo hablar.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Cada noche, elige un jugador para que sea tu amo.',
    },
    {
      type: 'CAVEAT',
      text: 'Solo puedes votar en ejecuciones si tu amo también vota.',
    },
    {
      type: 'ADVICE',
      text: 'Puedes abstenerte de votar incluso si tu amo vota.',
    },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],

  // NightAction UI
  info: 'Elige a tu Amo',
  selectPlayerAsMaster:
    'Despierta a {player} y registra a otro jugador como amo.',
  masterLabel: 'Amo: {player}',
  voteRestriction: 'Solo puede votar si su amo vota',

  // History
  history: {
    choseMaster: '{player} eligió a {target} como su amo',
  },
} as const

export default es
