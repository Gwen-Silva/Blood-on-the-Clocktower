// Official Trouble Brewing pages, keyed by stable IDs, never translated names.
export const ROLE_WIKI_PAGES: Readonly<Record<string, string>> = {
  washerwoman: 'Washerwoman',
  librarian: 'Librarian',
  investigator: 'Investigator',
  chef: 'Chef',
  empath: 'Empath',
  fortune_teller: 'Fortune_Teller',
  undertaker: 'Undertaker',
  monk: 'Monk',
  ravenkeeper: 'Ravenkeeper',
  virgin: 'Virgin',
  slayer: 'Slayer',
  soldier: 'Soldier',
  mayor: 'Mayor',
  butler: 'Butler',
  drunk: 'Drunk',
  recluse: 'Recluse',
  saint: 'Saint',
  poisoner: 'Poisoner',
  spy: 'Spy',
  scarlet_woman: 'Scarlet_Woman',
  baron: 'Baron',
  imp: 'Imp',
}
export function getRoleWikiUrl(roleId: string): string | undefined {
  const page = Object.hasOwn(ROLE_WIKI_PAGES, roleId)
    ? ROLE_WIKI_PAGES[roleId]
    : undefined
  return page ? `https://wiki.bloodontheclocktower.com/${page}` : undefined
}
