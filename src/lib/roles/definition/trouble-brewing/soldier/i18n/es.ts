const es = {
  name: 'Soldado',
  description:
    'Estás a salvo del Demonio. La ejecución y otras habilidades aún pueden matarte.',
  quote: 'El escudo aguanta. Siempre aguanta.',
  lines: [
    { type: 'PASSIVE', text: 'El Demonio no puede matarte.' },
    {
      type: 'CAVEAT',
      text: 'Aún puedes morir por ejecución u otras habilidades.',
    },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],

  // RoleReveal UI
  soldierInfo: 'Tu Protección',
  permanentlyProtected: 'A salvo del Demonio mientras funcione la habilidad.',
} as const

export default es
