const ptBR = {
  name: 'Espião',
  description:
    'A cada noite, consulte o Grimório. Você pode se registrar como do Bem e como Cidadão ou Forasteiro, mesmo após morrer.',
  quote: 'Sei o que eles sabem. Eles só não sabem que eu sei.',
  lines: [
    {
      type: 'NIGHT',
      text: 'A cada noite, você pode consultar o Grimório do Narrador.',
    },
    {
      type: 'ADVICE',
      text: 'O Grimório contém os personagens reais e o estado de todos os jogadores.',
    },
    {
      type: 'PASSIVE',
      text: 'Você pode se registrar como do Bem, Cidadão ou Forasteiro para outros jogadores.',
    },
    {
      type: 'WIN',
      text: 'O Mal normalmente vence com 2 jogadores vivos, incluindo um Demônio.',
    },
  ],
  spyGrimoireTitle: 'O Grimório',
  spyGrimoireDescription:
    'Você pode ver todos os jogadores e seus personagens.',
  spyMalfunctionTitle: 'O Grimório',
  spyMalfunctionDescription:
    'Sem habilidade: prepare um Grimório físico com informações verdadeiras ou falsas.',
  evilTeamTitle: 'Sua equipe do Mal',
  evilTeamDescription: 'Estes são seus aliados do Mal.',
  history: {
    viewedGrimoire: '{player} consultou o Grimório',
  },
}

export default ptBR
