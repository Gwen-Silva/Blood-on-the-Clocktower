const es = {
  name: 'Enterrador',
  description:
    'Cada noche salvo la primera, conoce el personaje de quien murió por ejecución hoy.',
  quote: 'Los muertos siempre dicen la verdad. Solo hay que saber dónde mirar.',
  lines: [
    {
      type: 'NIGHT',
      text: 'Cada noche salvo la primera, conoce el personaje de quien murió por ejecución hoy.',
    },
    {
      type: 'INFO',
      text: 'Si nadie murió por ejecución, no recibes personaje.',
    },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],

  // NightAction UI
  undertakerInfo: 'El Rol del Ejecutado',
  executedPlayerRole: 'Quien murió por ejecución era…',
  noExecutionToday: 'Hoy nadie murió por ejecución.',

  // History
  history: {
    sawExecutedRole:
      '{player} descubrió que el jugador ejecutado era el/la {role}',
    noExecution: '{player} recibió: nadie murió por ejecución',
  },
} as const

export default es
