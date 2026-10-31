const ptBR = {
  name: 'Empata',
  description:
    'A cada noite, descubra quantos dos seus 2 vizinhos vivos mais próximos se registram como do Mal.',
  quote: 'Sinto o peso dos pecados deles, mesmo quando sorriem.',
  lines: [
    {
      type: 'NIGHT',
      text: 'A cada noite, descubra quantos dos seus vizinhos vivos são do Mal.',
    },
    {
      type: 'INFO',
      text: 'Se um vizinho morrer, conte o próximo jogador vivo naquela direção.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  info: 'Informação do Empata',
  evilNeighborsCount: 'Vizinhos vivos do Mal:',
  evilNeighborsExplanation:
    'Quantidade de jogadores do Mal entre seus dois vizinhos vivos mais próximos.',
  history: {
    sawEvilNeighbors: '{player} recebeu a informação: {count} vizinhos do Mal',
  },
}

export default ptBR
