const es = {
  name: 'Adivino',
  description:
    'Cada noche, elige a 2 jugadores: sabes si alguno se registra como Demonio. Un jugador bueno también se registra como Demonio para ti.',
  quote: 'Toda visión es verdadera. No toda visión es honesta.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Cada noche, elige 2 jugadores: descubres si alguno de ellos es el Demonio.',
    },
    {
      type: 'CAVEAT',
      text: 'Un jugador bueno ha sido elegido para registrarse siempre como Demonio para ti.',
    },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],

  // SetupAction UI
  redHerringSetupTitle: 'Configuración de Pista Falsa',

  // NightAction UI
  fortuneTellerInfo: 'Tu Visión',
  selectTwoPlayersToCheck:
    'Despierta a {player} y pídele que señale a 2 jugadores para comprobar si son Demonios.',
  selectRedHerring: 'Asignar Pista Falsa',
  redHerringInfo:
    'Selecciona un jugador bueno que se registrará como Demonio para este Adivino.',
  selectGoodPlayerAsRedHerring: 'Selecciona un jugador bueno como Pista Falsa',
  selectRandomRedHerring: 'Aleatorio',
  yesOneIsDemon: 'SÍ',
  noNeitherIsDemon: 'NO',
  fortuneTellerDemonDetected: 'Resultado: sí',
  fortuneTellerNoDemon: 'Resultado: no',

  // History
  history: {
    sawDemon: '{player} consultó a {player1} y {player2}: SÍ',
    sawNoDemon: '{player} consultó a {player1} y {player2}: NO',
    redHerringAssigned:
      '{redHerring} fue asignado como la Pista Falsa para {player}',
  },
} as const

export default es
