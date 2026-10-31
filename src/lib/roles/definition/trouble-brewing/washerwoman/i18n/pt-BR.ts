const ptBR = {
  name: 'Lavadeira',
  description:
    'Na Noite 1, conheça 2 jogadores e um personagem Cidadão. Um deles se registra como esse personagem.',
  quote: 'Até a roupa mais suja guarda vestígios de quem a usou.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Na Noite 1, você recebe dois nomes e um personagem Cidadão. Um dos jogadores se registra como esse personagem.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  washerwomanInfo: 'Sua informação',
  mustIncludeTownsfolk:
    'Inclua um jogador que possa se registrar como o personagem mostrado.',
  oneOfTheseIsTheTownsfolk:
    'Um destes jogadores é um Cidadão. Memorize os nomes!',
  noTownsfolkInGame: 'Sem Cidadãos',
  noTownsfolkMessage:
    'Não há outros Cidadãos nesta partida. Esta informação é importante!',
  confirmNoTownsfolk: 'Mostrar ao jogador',
  showNoTownsfolk: 'Mostrar “Sem Cidadãos”',
  history: {
    discoveredTownsfolk: '{player} recebeu: {player1} ou {player2}, {role}',
    noTownsfolk:
      '{player} recebeu a informação de que não há outros Cidadãos na partida',
  },
}

export default ptBR
