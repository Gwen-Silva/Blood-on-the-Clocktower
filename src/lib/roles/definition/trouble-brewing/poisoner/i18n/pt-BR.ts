const ptBR = {
  name: 'Envenenador',
  description:
    'A cada noite, escolha um jogador: ele fica envenenado nesta noite e no dia seguinte.',
  quote:
    'Um pouco de paciência, um pouco de pó. Ninguém suspeita do cozinheiro.',
  lines: [
    {
      type: 'NIGHT',
      text: 'A cada noite, escolha um jogador para envenenar até o próximo anoitecer.',
    },
    {
      type: 'CAVEAT',
      text: 'Jogadores envenenados não têm habilidade, mas podem receber informações verdadeiras ou falsas sem saber por quê.',
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
  info: 'Escolha um alvo',
  selectPlayerToPoison:
    'Acorde {player} e anote o alvo para esta noite e o dia seguinte.',
  evilTeamTitle: 'Sua equipe do Mal',
  evilTeamDescription: 'Estes são seus aliados do Mal.',
  history: {
    poisonedPlayer: '{player} envenenou {target}',
    shownEvilTeam: '{player} viu a equipe do Mal',
  },
}

export default ptBR
