const es = {
  name: 'Monje',
  description:
    'Cada noche salvo la primera, elige a otro jugador: está a salvo del Demonio esta noche.',
  quote: 'En silencio hago vigilia, para que otros puedan despertar.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Cada noche salvo la primera, elige a otro jugador: está a salvo del Demonio esta noche.',
    },
    { type: 'PROTECT', text: 'No puedes protegerte a ti mismo.' },
    {
      type: 'INFO',
      text: 'La primera noche no despierta, ya que el Demonio no ataca.',
    },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],

  // NightAction UI
  info: 'Elige un Jugador',
  selectPlayerToProtect:
    'Despierta a {player} y pídele que señale a un jugador para proteger del Demonio.',
  protectedForTheNight: 'está protegido/a por esta noche.',

  // History
  history: {
    protectedPlayer: '{player} protegió a {target} por esta noche',
  },
} as const

export default es
