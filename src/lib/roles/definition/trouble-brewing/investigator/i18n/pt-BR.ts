const ptBR = {
  name: 'Investigador',
  description:
    'Na Noite 1, você descobre que um de dois jogadores é um Lacaio específico.',
  quote: 'Siga o dinheiro. Siga os sussurros. Siga o medo.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Na Noite 1, você recebe dois nomes e um personagem Lacaio. Um dos jogadores se registra como esse personagem.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  investigatorInfo: 'Sua informação',
  mustIncludeMinion:
    'Inclua um jogador que possa se registrar como o personagem mostrado.',
  oneOfTheseIsTheMinion: 'Um destes jogadores é um Lacaio. Memorize os nomes!',
  noMinionsInGame: 'Sem Lacaios',
  noMinionsMessage:
    'Não há Lacaios nesta partida. Esta informação é importante!',
  confirmNoMinions: 'Mostrar ao jogador',
  showNoMinions: 'Mostrar “Sem Lacaios”',
  history: {
    discoveredMinion: '{player} recebeu: {player1} ou {player2}, {role}',
    noMinions: '{player} recebeu a informação de que não há Lacaios na partida',
  },
}

export default ptBR
