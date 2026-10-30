const ptBR = {
  name: 'Guardião dos Corvos',
  description:
    'Se morrer à noite, escolha um jogador e descubra seu personagem conforme ele se registra para você.',
  quote: 'Meu último suspiro não será em vão. Alguém terá seu nome revelado.',
  lines: [
    {
      type: 'ON_DEATH',
      text: 'Se morrer à noite, acorde, escolha qualquer jogador e descubra seu personagem.',
    },
    {
      type: 'INFO',
      text: 'Só funciona se você morrer à noite, não por execução.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  ravenkeeperInfo: 'Escolha um jogador',
  selectPlayerToSeeRole:
    'Acorde {player} e peça que aponte um jogador para descobrir seu personagem.',
  playerRoleIs: 'O personagem mostrado é...',
  history: {
    sawRole: '{player} escolheu consultar {target} e recebeu: {role}',
  },
}

export default ptBR
