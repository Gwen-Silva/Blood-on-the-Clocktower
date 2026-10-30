const es = {
  name: 'Mujer Escarlata',
  description:
    'Si el Demonio muere con al menos 5 jugadores vivos, te conviertes en Demonio. Cuenta al Demonio que muere, no a los Viajeros.',
  quote: 'Cuando el trono caiga, yo ya llevaré la corona.',
  lines: [
    {
      type: 'PASSIVE',
      text: 'Si el Demonio muere y quedan 5+ jugadores vivos, te conviertes en el nuevo Demonio.',
    },
    {
      type: 'TEAM',
      text: 'Con 7+ jugadores, conoces a tus compañeros del Mal.',
    },
    { type: 'WIN', text: 'Un Demonio debe permanecer vivo para ganar.' },
  ],

  // First night: evil team
  evilTeamTitle: 'Tu Equipo Malvado',
  evilTeamDescription: 'Estos son tus compañeros malvados.',

  // History
  history: {
    becameDemon: '{player} se convirtió en el/la {role}',
    shownEvilTeam: '{player} vio al equipo malvado',
  },
} as const

export default es
