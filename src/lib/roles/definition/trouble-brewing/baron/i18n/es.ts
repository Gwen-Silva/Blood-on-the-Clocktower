const es = {
  name: 'Barón',
  description: 'La preparación sustituye 2 Aldeanos por 2 Forasteros.',
  quote: 'La corrupción empieza arriba. Desde ahí se filtra.',
  lines: [
    {
      type: 'SETUP',
      text: 'Se añaden dos Forasteros extra al juego, reemplazando Aldeanos.',
    },
    { type: 'ADVICE', text: 'Más Forasteros significa más caos.' },
    {
      type: 'TEAM',
      text: 'Con 7+ jugadores, conoces a tus compañeros del Mal.',
    },
    {
      type: 'WIN',
      text: 'El mal normalmente gana con 2 jugadores vivos, incluido un Demonio.',
    },
  ],

  // First night: evil team
  evilTeamTitle: 'Tu Equipo Malvado',
  evilTeamDescription: 'Estos son tus compañeros malvados.',

  // History
  history: {
    shownEvilTeam: '{player} vio al equipo malvado',
  },
} as const

export default es
