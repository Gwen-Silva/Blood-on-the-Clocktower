const es = {
  name: 'Envenenador',
  description:
    'Cada noche, elige a un jugador: tiene veneno esta noche y durante el día siguiente.',
  quote: 'Un poco de paciencia, un poco de polvo. Nadie sospecha del cocinero.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Cada noche, elige un jugador para envenenar hasta el siguiente anochecer.',
    },
    {
      type: 'CAVEAT',
      text: 'Los jugadores envenenados no tienen habilidad, pero pueden recibir información arbitraria, verdadera o falsa, sin saber por qué.',
    },
    {
      type: 'TEAM',
      text: 'Con 7+ jugadores, conoces a tus compañeros del Mal.',
    },
    {
      type: 'WIN',
      text: 'El mal normalmente gana con 2 jugadores vivos, incluido un Demonio.',
    },
  ],

  // NightAction UI
  info: 'Elige un Objetivo',
  selectPlayerToPoison:
    'Despierta a {player} y registra su objetivo para esta noche y el día siguiente.',

  // First night: evil team
  evilTeamTitle: 'Tu Equipo Malvado',
  evilTeamDescription: 'Estos son tus compañeros malvados.',

  // History
  history: {
    poisonedPlayer: '{player} envenenó a {target}',
    shownEvilTeam: '{player} vio al equipo malvado',
  },
} as const

export default es
