const en = {
  name: 'Saint',
  description: 'If you die by execution, your team loses.',
  quote:
    "To be martyred is human. To cause the town's downfall is something else.",
  lines: [
    { type: 'CAVEAT', text: 'If you die by execution, your team loses.' },
    { type: 'ADVICE', text: 'Convince the town they cannot execute you.' },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],
} as const

export default en
