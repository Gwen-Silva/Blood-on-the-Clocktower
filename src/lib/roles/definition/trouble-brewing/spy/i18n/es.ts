const es = {
  name: 'Espía',
  description:
    'Cada noche, examina el Grimorio. Puedes registrarte como bueno y como Aldeano o Forastero, incluso después de morir.',
  quote: 'Sé lo que ellos saben. Simplemente no saben que yo lo sé.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Cada noche, puedes mirar el Grimorio del Cuentacuentos.',
    },
    {
      type: 'ADVICE',
      text: 'El Grimorio contiene los roles reales y el estado de todos los jugadores.',
    },
    {
      type: 'PASSIVE',
      text: 'Puedes registrarte como bueno, como Aldeano o como Forastero.',
    },
    {
      type: 'WIN',
      text: 'El mal normalmente gana con 2 jugadores vivos, incluido un Demonio.',
    },
  ],

  // NightAction UI
  spyGrimoireTitle: 'El Grimorio',
  spyGrimoireDescription: 'Puedes ver a todos los jugadores y sus roles.',
  spyMalfunctionTitle: 'El Grimorio',
  spyMalfunctionDescription:
    'Sin habilidad: prepara un Grimorio físico con información verdadera o falsa.',

  // First night: evil team
  evilTeamTitle: 'Tu Equipo Malvado',
  evilTeamDescription: 'Estos son tus compañeros malvados.',

  // History
  history: {
    viewedGrimoire: '{player} miró el Grimorio',
  },
} as const

export default es
