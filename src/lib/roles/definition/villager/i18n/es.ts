const es = {
  name: 'Aldeano',
  description:
    'Personaje personalizado: sin habilidad. Ayuda al Bien a encontrar al Demonio.',
  quote: 'La fuerza del pueblo está en su gente. Cada voz cuenta.',
  lines: [
    { type: 'PASSIVE', text: 'No tienes ninguna habilidad especial.' },
    {
      type: 'ADVICE',
      text: 'Escucha, debate y usa tu voto sabiamente: tu juicio es tu arma.',
    },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],
} as const

export default es
