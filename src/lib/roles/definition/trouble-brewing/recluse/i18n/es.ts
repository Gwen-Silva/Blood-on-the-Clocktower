const es = {
  name: 'Recluso',
  description:
    'Puedes registrarte como malvado, Secuaz o Demonio, incluso después de morir. Sigues siendo del Bien.',
  quote: 'Me evitan. Quizás tienen razón.',
  lines: [
    {
      type: 'PASSIVE',
      text: 'Puedes registrarte como malvado, Secuaz o Demonio, incluso después de morir. Sigues siendo del Bien.',
    },
    {
      type: 'CAVEAT',
      text: 'Otros roles con la habilidad de ver tu rol podrían ver un rol falso en su lugar.',
    },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],
} as const

export default es
