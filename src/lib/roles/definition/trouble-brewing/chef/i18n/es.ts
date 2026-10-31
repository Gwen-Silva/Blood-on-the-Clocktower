const es = {
  name: 'Chef',
  description:
    'La primera noche, conoce el número de parejas malvadas adyacentes en el círculo.',
  quote:
    'Demasiados cocineros arruinan el caldo. Pero un buen chef cuenta los cuchillos.',
  lines: [
    {
      type: 'NIGHT',
      text: 'En la primera noche, descubres cuántas parejas de jugadores malvados están sentados juntos.',
    },
    {
      type: 'INFO',
      text: 'Tres jugadores malvados consecutivos forman 2 parejas.',
    },
    {
      type: 'WIN',
      text: 'El bien normalmente gana cuando no queda ningún Demonio vivo.',
    },
  ],

  // NightAction UI
  info: 'Tu Información',
  evilPairsCount: 'Parejas malvadas sentadas juntas:',
  evilPairsExplanation:
    'Este es el número de parejas de jugadores malvados que están sentados uno al lado del otro.',

  // History
  history: {
    sawEvilPairs:
      '{player} descubrió que hay {count} parejas de jugadores malvados sentados juntos',
  },
} as const

export default es
