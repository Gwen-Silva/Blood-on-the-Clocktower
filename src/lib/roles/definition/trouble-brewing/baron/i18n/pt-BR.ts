const ptBR = {
  name: 'Barão',
  description: 'A preparação troca 2 Cidadãos por 2 Forasteiros.',
  quote: 'A corrupção começa no topo e escorre para baixo.',
  lines: [
    {
      type: 'SETUP',
      text: 'Dois Forasteiros extras entram no jogo no lugar de Cidadãos.',
    },
    {
      type: 'ADVICE',
      text: 'Mais Forasteiros trazem mais caos.',
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
    shownEvilTeam: '{player} viu a equipe do Mal',
  },
}

export default ptBR
