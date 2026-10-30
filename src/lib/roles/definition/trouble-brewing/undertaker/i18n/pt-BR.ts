const ptBR = {
  name: 'Coveiro',
  description:
    'A cada noite, exceto a primeira, descubra o personagem de quem morreu por execução hoje.',
  quote: 'Os mortos sempre dizem a verdade. Basta saber onde procurar.',
  lines: [
    {
      type: 'NIGHT',
      text: 'A cada noite, exceto a primeira, descubra o personagem de quem morreu por execução hoje.',
    },
    {
      type: 'INFO',
      text: 'Se ninguém morreu por execução, não há personagem a descobrir.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  undertakerInfo: 'Personagem de quem morreu por execução',
  executedPlayerRole: 'Quem morreu por execução era…',
  noExecutionToday: 'Ninguém morreu por execução hoje.',
  history: {
    sawExecutedRole:
      '{player} recebeu a informação do personagem executado: {role}',
    noExecution: '{player} recebeu: ninguém morreu por execução',
  },
}

export default ptBR
