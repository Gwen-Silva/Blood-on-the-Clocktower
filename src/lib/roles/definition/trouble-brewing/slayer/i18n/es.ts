const es = {
  name: 'Verdugo',
  description:
    'Una vez por partida y de día, elige públicamente a alguien: si se registra como Demonio, muere.',
  quote: 'Un disparo. Que cuente.',
  lines: [
    {
      type: 'DAY',
      text: 'Durante el día, puedes disparar públicamente a un jugador.',
    },
    {
      type: 'INFO',
      text: 'Si se registra como Demonio, muere. Si no, no pasa nada.',
    },
    { type: 'CAVEAT', text: 'Sólo tienes un disparo.' },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],

  // History
  history: {
    targetDied: '¡{slayer} disparó a {target} — el objetivo murió!',
    missed: '{slayer} disparó a {target} — no pasó nada',
  },
} as const

export default es
