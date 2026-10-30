const ptBR = {
  name: 'Monge',
  description:
    'A cada noite, exceto a primeira, escolha outro jogador: ele fica protegido do Demônio nesta noite.',
  quote: 'Vigio em silêncio para que os outros possam acordar.',
  lines: [
    {
      type: 'NIGHT',
      text: 'A cada noite, exceto a primeira, escolha outro jogador: ele fica protegido do Demônio nesta noite.',
    },
    {
      type: 'PROTECT',
      text: 'Você não pode proteger a si mesmo.',
    },
    {
      type: 'INFO',
      text: 'Você não acorda na primeira noite, pois o Demônio não ataca.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  info: 'Escolha um jogador',
  selectPlayerToProtect:
    'Acorde {player} e peça que aponte um jogador para proteger do Demônio.',
  protectedForTheNight: 'está protegido nesta noite.',
  history: {
    protectedPlayer: '{player} protegeu {target} nesta noite',
  },
}

export default ptBR
