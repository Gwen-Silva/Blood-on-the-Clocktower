const en = {
  name: 'Drunk',
  description:
    'You think you are a Townsfolk, but have no Townsfolk ability. Information may be true or false.',
  quote: "The warmest nights are the ones you can't quite remember.",
  lines: [
    { type: 'PASSIVE', text: 'You believe you are a Townsfolk. You are not.' },
    {
      type: 'CAVEAT',
      text: "Instead of this card, you see another role's card.",
    },
    {
      type: 'CAVEAT',
      text: 'Whatever ability you think you have does not work. The Storyteller may give you true or false information.',
    },
    { type: 'WIN', text: 'Good normally wins when no Demon remains alive.' },
  ],

  // SetupAction UI
  drunkSetupTitle: 'Drunk Setup',
  drunkSetupDescription:
    'Choose the Townsfolk they believe they are; keep the Drunk secret.',
  chooseBelievedRole: 'Choose the believed Townsfolk role',
} as const

export default en
