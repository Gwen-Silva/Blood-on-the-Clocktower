const es = {
  name: 'Santo',
  description: 'Si mueres por ejecución, tu equipo pierde.',
  quote: 'Ser mártir es humano. Causar la caída del pueblo es otra cosa.',
  lines: [
    { type: 'CAVEAT', text: 'Si mueres por ejecución, tu equipo pierde.' },
    { type: 'ADVICE', text: 'Convence al pueblo de que no te ejecuten.' },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],
} as const

export default es
