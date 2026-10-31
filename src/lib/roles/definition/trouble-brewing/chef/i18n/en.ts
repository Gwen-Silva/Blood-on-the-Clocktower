const en = {
  name: 'Chef',
  description:
    'On Night 1, learn the number of adjacent evil pairs around the circle.',
  quote: 'Too many cooks spoil the broth. But a wise chef counts the knives.',
  lines: [
    {
      type: 'NIGHT',
      text: 'In the first night, you learn how many pairs of evil players are sitting next to each other.',
    },
    {
      type: 'INFO',
      text: 'Three consecutive evil players form 2 pairs.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // NightAction UI
  info: "Chef's Information",
  evilPairsCount: 'Evil pairs sitting together:',
  evilPairsExplanation:
    'This is the number of pairs of evil players that are sitting next to each other.',

  // History
  history: {
    sawEvilPairs:
      '{player} learned there are {count} pairs of evil players sitting together',
  },
} as const

export default en
