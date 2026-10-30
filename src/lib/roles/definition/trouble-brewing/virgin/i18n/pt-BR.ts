const ptBR = {
  name: 'Virgem',
  description:
    'Na primeira vez que você receber uma nomeação, quem nomeou é executado imediatamente se registrar como Cidadão.',
  quote: 'A inocência é a lâmina mais afiada. Mas só corta uma vez.',
  lines: [
    {
      type: 'PASSIVE',
      text: 'Na primeira vez que você receber uma nomeação, quem nomeou é executado imediatamente se registrar como Cidadão.',
    },
    {
      type: 'INFO',
      text: 'Se quem nomeou não se registrar como Cidadão, nada acontece e a nomeação continua.',
    },
    {
      type: 'CAVEAT',
      text: 'A habilidade é gasta após a primeira nomeação, qualquer que seja o resultado.',
    },
    {
      type: 'WIN',
      text: 'O Bem normalmente vence quando não resta Demônio vivo.',
    },
  ],
  history: {
    townsfolkExecuted: '{nominator} nomeou a Virgem e recebeu uma execução!',
    lostPurity: '{nominator} nomeou a Virgem. A habilidade dela foi gasta',
  },
}

export default ptBR
