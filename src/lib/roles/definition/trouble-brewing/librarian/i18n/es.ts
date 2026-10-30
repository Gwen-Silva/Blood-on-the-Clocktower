const es = {
  name: 'Bibliotecario',
  description:
    'Empiezas sabiendo que 1 de 2 jugadores es un Forastero en particular. (O que no hay ninguno en juego.)',
  quote: 'Cada nombre tiene una historia. Algunas historias son advertencias.',
  lines: [
    {
      type: 'FIRST_NIGHT',
      text: 'Conoce 2 candidatos y un personaje Forastero como el que uno se registra, o que hay cero Forasteros en juego.',
    },
    { type: 'WIN', text: 'Ejecuta al Demonio para ganar.' },
  ],

  // NightAction UI
  librarianInfo: 'Tu Información',
  mustIncludeOutsider:
    'Al menos un candidato debe poder registrarse como el Forastero mostrado',
  oneOfTheseIsTheOutsider:
    'Uno de estos jugadores es un Forastero. ¡Recuerda quiénes son!',
  noOutsidersInGame: 'Sin Forasteros',
  noOutsidersMessage:
    'No hay Forasteros en esta partida. ¡Esta es información valiosa!',
  confirmNoOutsiders: 'Mostrar al Jugador',
  showNoOutsiders: 'Mostrar "Sin Forasteros"',

  // History
  history: {
    discoveredOutsider:
      '{player} descubrió que {player1} o {player2} es el/la {role}',
    noOutsiders: '{player} descubrió que no hay Forasteros en esta partida',
  },
} as const

export default es
