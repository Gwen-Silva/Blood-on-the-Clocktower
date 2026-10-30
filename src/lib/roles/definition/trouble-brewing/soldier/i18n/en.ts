const en = {
  name: 'Soldier',
  description:
    'You are safe from the Demon. Execution and other abilities can still kill you.',
  quote: 'The shield holds. It always holds.',
  lines: [
    { type: 'PASSIVE', text: 'You cannot be killed by the Demon.' },
    {
      type: 'CAVEAT',
      text: 'You can still die by execution or other abilities.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // RoleReveal UI
  soldierInfo: 'Your Protection',
  permanentlyProtected: 'Safe from the Demon while the ability works.',
} as const

export default en
