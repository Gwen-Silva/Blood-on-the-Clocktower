const es = {
  name: 'Investigador',
  description:
    'La primera noche, conoce 2 jugadores y un personaje Secuaz. Uno se registra como ese personaje.',
  quote: 'Sigue el dinero. Sigue los susurros. Sigue el miedo.',
  lines: [
    {
      type: 'NIGHT',
      text: 'La primera noche, conoce 2 candidatos y un personaje Secuaz como el que uno se registra.',
    },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],

  // NightAction UI
  investigatorInfo: 'Tu Información',
  mustIncludeMinion:
    'Incluye un candidato que pueda registrarse como ese personaje.',
  oneOfTheseIsTheMinion:
    'Uno de estos jugadores es un Secuaz. ¡Recuerda quiénes son!',
  noMinionsInGame: 'Sin Secuaces',
  noMinionsMessage:
    'No hay Secuaces en esta partida. ¡Esta es información valiosa!',
  confirmNoMinions: 'Mostrar al Jugador',
  showNoMinions: 'Mostrar "Sin Secuaces"',

  // History
  history: {
    discoveredMinion: '{player} recibió: {player1} o {player2}, {role}',
    noMinions: '{player} descubrió que no hay Secuaces en esta partida',
  },
} as const

export default es
