const es = {
  name: 'Alcalde',
  description:
    'Al anochecer, si viven 3 jugadores y hoy nadie recibió una ejecución, tu equipo gana. De noche, alguien podría morir en tu lugar.',
  quote: 'El pueblo perdura porque alguien debe mantener la línea.',
  lines: [
    {
      type: 'PASSIVE',
      text: 'Al anochecer, si viven 3 jugadores y hoy no hubo ejecución, gana el bien.',
    },
    {
      type: 'PROTECT',
      text: 'Si el demonio intenta matarte de noche, es posible que muera otro jugador en tu lugar.',
    },
    {
      type: 'WIN',
      text: 'El bien gana sin Demonios vivos o con tu habilidad al final del día.',
    },
  ],
} as const

export default es
