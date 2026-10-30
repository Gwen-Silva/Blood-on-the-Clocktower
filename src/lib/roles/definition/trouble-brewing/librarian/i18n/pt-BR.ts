const ptBR = {
  name: 'Bibliotecário',
  description:
    'Na Noite 1, você descobre que um de dois jogadores é um Forasteiro específico, ou que não há Forasteiros.',
  quote: 'Todo nome tem uma história. Algumas são avisos.',
  lines: [
    {
      type: 'FIRST_NIGHT',
      text: 'Você recebe dois nomes e um personagem Forasteiro. Um dos jogadores se registra como esse personagem. Outra opção é descobrir que não há Forasteiros.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  librarianInfo: 'Sua informação',
  mustIncludeOutsider:
    'Inclua um jogador que possa se registrar como o personagem mostrado.',
  oneOfTheseIsTheOutsider:
    'Um destes jogadores é um Forasteiro. Memorize os nomes!',
  noOutsidersInGame: 'Sem Forasteiros',
  noOutsidersMessage: 'Informação recebida: nenhum Forasteiro.',
  confirmNoOutsiders: 'Mostrar ao jogador',
  showNoOutsiders: 'Mostrar “Sem Forasteiros”',
  history: {
    discoveredOutsider: '{player} recebeu: {player1} ou {player2}, {role}',
    noOutsiders:
      '{player} recebeu a informação de que não há Forasteiros na partida',
  },
}

export default ptBR
