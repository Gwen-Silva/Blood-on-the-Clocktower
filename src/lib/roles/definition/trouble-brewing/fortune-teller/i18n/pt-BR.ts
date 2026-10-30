const ptBR = {
  name: 'Adivinho',
  description:
    'A cada noite, escolha 2 jogadores e descubra se algum se registra como Demônio. Um jogador do Bem também se registra como Demônio para você.',
  quote: 'Toda visão é verdadeira. Nem toda visão é honesta.',
  lines: [
    {
      type: 'NIGHT',
      text: 'A cada noite, escolha 2 jogadores e descubra se algum é o Demônio.',
    },
    {
      type: 'CAVEAT',
      text: 'Um jogador do Bem foi escolhido para sempre se registrar como Demônio para você.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  redHerringSetupTitle: 'Definir Pista Falsa',
  fortuneTellerInfo: 'Sua visão',
  selectTwoPlayersToCheck:
    'Acorde {player} e peça que aponte 2 jogadores para consultar.',
  selectRedHerring: 'Definir Pista Falsa',
  redHerringInfo:
    'Escolha um jogador do Bem que se registrará como Demônio para este Adivinho.',
  selectGoodPlayerAsRedHerring: 'Escolha um jogador do Bem como Pista Falsa',
  selectRandomRedHerring: 'Aleatório',
  yesOneIsDemon: 'SIM',
  noNeitherIsDemon: 'NÃO',
  fortuneTellerDemonDetected: 'Resultado: sim',
  fortuneTellerNoDemon: 'Resultado: não',
  history: {
    sawDemon: '{player} consultou {player1} e {player2}: SIM',
    sawNoDemon: '{player} consultou {player1} e {player2}: NÃO',
    redHerringAssigned:
      '{redHerring} foi definido como Pista Falsa para {player}',
  },
}

export default ptBR
