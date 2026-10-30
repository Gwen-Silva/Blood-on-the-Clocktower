const ptBR = {
  name: 'Mulher Escarlate',
  description:
    'Se o Demônio morrer com pelo menos 5 jogadores vivos, você vira o Demônio. Conte o Demônio que morre; não conte Viajantes.',
  quote: 'Quando o trono cair, eu já estarei usando a coroa.',
  lines: [
    {
      type: 'PASSIVE',
      text: 'Se o Demônio morrer com 5 ou mais jogadores vivos, você vira o novo Demônio.',
    },
    {
      type: 'TEAM',
      text: 'Com 7 ou mais jogadores, você conhece seus aliados do Mal.',
    },
    {
      type: 'WIN',
      text: 'O Mal normalmente vence com 2 jogadores vivos, incluindo um Demônio.',
    },
  ],
  evilTeamTitle: 'Sua equipe do Mal',
  evilTeamDescription: 'Estes são seus aliados do Mal.',
  history: {
    becameDemon: '{player} passou a ser {role}',
    shownEvilTeam: '{player} viu a equipe do Mal',
  },
}

export default ptBR
