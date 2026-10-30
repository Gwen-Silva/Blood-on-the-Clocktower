const es = {
  name: 'Lavandera',
  description:
    'La primera noche, conoce 2 jugadores y un personaje Aldeano. Uno se registra como ese personaje.',
  quote: 'Hasta las sábanas más sucias guardan rastros de quien las vistió.',
  lines: [
    {
      type: 'NIGHT',
      text: 'La primera noche, conoce 2 candidatos y un personaje Aldeano como el que uno se registra.',
    },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],

  // NightAction UI
  washerwomanInfo: 'Tu Información',
  mustIncludeTownsfolk:
    'Incluye un candidato que pueda registrarse como ese personaje.',
  oneOfTheseIsTheTownsfolk:
    'Uno de estos jugadores es un Aldeano. ¡Recuerda quiénes son!',
  noTownsfolkInGame: 'Sin Aldeanos',
  noTownsfolkMessage:
    'No hay otros Aldeanos en esta partida. ¡Esta es información valiosa!',
  confirmNoTownsfolk: 'Mostrar al Jugador',
  showNoTownsfolk: 'Mostrar "Sin Aldeanos"',

  // History
  history: {
    discoveredTownsfolk: '{player} recibió: {player1} o {player2}, {role}',
    noTownsfolk: '{player} descubrió que no hay otros Aldeanos en esta partida',
  },
} as const

export default es
