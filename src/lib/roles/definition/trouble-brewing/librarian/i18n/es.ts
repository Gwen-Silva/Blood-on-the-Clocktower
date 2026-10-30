const es = {
  name: 'Bibliotecario',
  description:
    'La primera noche, conoce 2 jugadores y un personaje Forastero: uno se registra como tal. O conoce que no hay Forasteros.',
  quote: 'Cada nombre tiene una historia. Algunas historias son advertencias.',
  lines: [
    {
      type: 'FIRST_NIGHT',
      text: 'Conoce 2 candidatos y un personaje Forastero como el que uno se registra, o que hay cero Forasteros en juego.',
    },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],

  // NightAction UI
  librarianInfo: 'Tu Información',
  mustIncludeOutsider:
    'Incluye un candidato que pueda registrarse como ese personaje.',
  oneOfTheseIsTheOutsider:
    'Uno de estos jugadores es un Forastero. ¡Recuerda quiénes son!',
  noOutsidersInGame: 'Sin Forasteros',
  noOutsidersMessage: 'Información recibida: cero Forasteros.',
  confirmNoOutsiders: 'Mostrar al Jugador',
  showNoOutsiders: 'Mostrar "Sin Forasteros"',

  // History
  history: {
    discoveredOutsider: '{player} recibió: {player1} o {player2}, {role}',
    noOutsiders: '{player} descubrió que no hay Forasteros en esta partida',
  },
} as const

export default es
