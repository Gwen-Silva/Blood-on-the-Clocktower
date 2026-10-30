const ptBR = {
  name: 'Caçador',
  description:
    'Uma vez por partida, durante o dia, escolha publicamente um jogador: se ele se registrar como Demônio, morre.',
  quote: 'Um disparo. Faça valer.',
  lines: [
    {
      type: 'DAY',
      text: 'Durante o dia, você pode disparar publicamente contra um jogador.',
    },
    {
      type: 'INFO',
      text: 'Se o alvo se registrar como Demônio, morre. Caso contrário, nada acontece.',
    },
    {
      type: 'CAVEAT',
      text: 'Você só tem um disparo.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  history: {
    targetDied: '{slayer} disparou contra {target}. O alvo morreu!',
    missed: '{slayer} disparou contra {target}. Nada aconteceu',
  },
}

export default ptBR
