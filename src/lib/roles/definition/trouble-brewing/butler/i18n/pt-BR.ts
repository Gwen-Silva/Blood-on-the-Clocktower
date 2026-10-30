const ptBR = {
  name: 'Mordomo',
  description:
    'A cada noite, escolha outro jogador. Amanhã, você só pode votar enquanto essa pessoa também vota.',
  quote: 'Sirvo ao meu mestre. Ele decide quando posso falar.',
  lines: [
    {
      type: 'NIGHT',
      text: 'A cada noite, escolha outro jogador como seu mestre para o dia.',
    },
    {
      type: 'CAVEAT',
      text: 'Você só pode votar em execuções enquanto seu mestre também vota.',
    },
    {
      type: 'ADVICE',
      text: 'Você pode não votar, mesmo que seu mestre vote.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  info: 'Escolha seu mestre',
  selectPlayerAsMaster: 'Acorde {player} e anote outro jogador como mestre.',
  masterLabel: 'Mestre: {player}',
  voteRestriction: 'Só pode votar enquanto o mestre vota',
  history: {
    choseMaster: '{player} escolheu {target} como mestre',
  },
}

export default ptBR
