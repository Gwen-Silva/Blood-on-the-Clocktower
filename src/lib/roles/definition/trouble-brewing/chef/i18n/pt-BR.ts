const ptBR = {
  name: 'Cozinheiro',
  description:
    'Na Noite 1, descubra quantos pares de vizinhos do Mal há no círculo.',
  quote: 'Muitos cozinheiros estragam o caldo. O sábio conta as facas.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Na primeira noite, descubra quantos pares de jogadores do Mal estão sentados lado a lado.',
    },
    {
      type: 'INFO',
      text: 'Três jogadores do Mal consecutivos formam 2 pares.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  info: 'Informação do Cozinheiro',
  evilPairsCount: 'Pares de vizinhos do Mal:',
  evilPairsExplanation:
    'Quantidade de pares de jogadores do Mal sentados lado a lado.',
  history: {
    sawEvilPairs:
      '{player} recebeu a informação: {count} pares de vizinhos do Mal',
  },
}

export default ptBR
