import { test, expect, type Page, type Locator } from '@playwright/test'
import { makeGame, makeState, makePlayer } from '../src/lib/__tests__/helpers'
import {
  addHistoryEntry,
  nominate,
  resolveVote,
  getBlockStatus,
  getVoteBenchmark,
} from '../src/lib/game'
import {
  recordVoteOperation,
  getEligibleVoteOperation,
  correctLatestVote,
  getEffectiveVoteHistory,
} from '../src/lib/voteHistory'
import { getCurrentState, type Game } from '../src/lib/types'
import en from '../src/lib/i18n/translations/en'
import es from '../src/lib/i18n/translations/es'
import pt from '../src/lib/i18n/translations/pt-BR'
import { interpolate } from '../src/lib/i18n'
const copies = { en, es, 'pt-BR': pt }
type Language = keyof typeof copies
function day() {
  const players = [
    ['a', 'Alice', 'soldier'],
    ['b', 'Bob', 'chef'],
    ['c', 'Carol', 'mayor'],
    ['d', 'Dave', 'butler'],
    ['e', 'Eve', 'imp'],
    ['f', 'Frank', 'spy'],
    ['g', 'Ghost', 'villager'],
  ].map(([id, name, roleId]) => makePlayer({ id, name, roleId }))
  players[3].effects = [
    {
      id: 'master-original',
      type: 'butler_master',
      data: { masterId: 'b', extra: { stable: true } },
      expiresAt: 'never',
    },
  ]
  players[6].effects = [
    {
      id: 'dead-original',
      type: 'dead',
      data: { reason: 'existing' },
      sourcePlayerId: 'e',
      expiresAt: 'never',
    },
  ]
  const game = makeGame(makeState({ phase: 'setup', round: 0, players }))
  game.name = 'Vote correction fixture'
  return addHistoryEntry(
    game,
    { type: 'day_started', data: { round: 2 }, message: [] },
    { phase: 'day', round: 2 },
  )
}
function withLead() {
  const base = nominate(day(), 'c', 'a')
  return recordVoteOperation(
    base,
    resolveVote(base, 'a', 4, ['a', 'b', 'c', 'f']),
  )
}
function tied() {
  const base = nominate(withLead(), 'f', 'b')
  return recordVoteOperation(
    base,
    resolveVote(base, 'b', 4, ['a', 'b', 'c', 'g']),
  )
}
async function activate(control: Locator) {
  if (await control.page().evaluate(() => navigator.maxTouchPoints > 0))
    await control.tap()
  else await control.click()
}
async function seed(page: Page, game: Game, language: Language = 'en') {
  await page.goto('./')
  await page.evaluate(
    ({ game, language }) => {
      localStorage.setItem(
        'grimoire_games',
        JSON.stringify({ version: 1, games: [game] }),
      )
      localStorage.setItem('grimoire_language', language)
    },
    { game, language },
  )
  await page.goto(`./game/${game.id}`)
}
async function saved(page: Page): Promise<Game> {
  return page.evaluate(() => {
    const v = JSON.parse(localStorage.getItem('grimoire_games')!)
    return (Array.isArray(v) ? v : v.games)[0]
  })
}
const voter = (page: Page, name: string) =>
  page.getByRole('group', { name, exact: true }).getByRole('button')
async function nomination(
  page: Page,
  language: Language,
  nominator = 'Alice',
  nominee = 'Bob',
) {
  const t = copies[language]
  await activate(
    page.getByRole('button', { name: new RegExp('^' + t.game.newNomination) }),
  )
  await activate(
    page
      .getByRole('button', { name: new RegExp('^' + nominator + '(?: |$)') })
      .first(),
  )
  await activate(
    page
      .getByRole('button', { name: new RegExp('^' + nominee + '(?: |$)') })
      .last(),
  )
  await activate(
    page.getByRole('button', { name: t.game.startNomination, exact: true }),
  )
}
async function history(page: Page, language: Language = 'en') {
  await activate(
    page.locator('nav.game-tools').getByRole('button', {
      name: copies[language].common.history,
      exact: true,
    }),
  )
}
async function correction(page: Page, language: Language = 'en') {
  const t = copies[language]
  await history(page, language)
  await activate(
    page.getByRole('button', { name: t.voteCorrection.action, exact: true }),
  )
  await activate(
    page.getByRole('button', { name: t.voteCorrection.confirm, exact: true }),
  )
  await expect(
    page.getByRole('heading', {
      name: interpolate(t.game.executePlayer, { player: 'Bob' }),
      exact: true,
    }),
  ).toBeVisible()
}
for (const language of ['pt-BR', 'en', 'es'] as const)
  test(`${language}: correct a real tally, restore ghost vote and repeat individual voters without renomination`, async ({
    page,
  }, info) => {
    const t = copies[language]
    await seed(page, day(), language)
    await nomination(page, language)
    await expect(voter(page, 'Dave')).toBeDisabled()
    for (const name of ['Bob', 'Alice', 'Carol', 'Dave', 'Ghost'])
      await activate(voter(page, name))
    await activate(
      page.getByRole('button', { name: t.game.confirmVotes, exact: true }),
    )
    const changed = await saved(page),
      op = getEligibleVoteOperation(changed)!,
      raw = await page.evaluate(() => localStorage.getItem('grimoire_games'))
    expect(op.voteCount).toBe(5)
    expect(
      getCurrentState(changed)
        .players.find((p) => p.id === 'g')!
        .effects.filter((e) => e.type === 'used_dead_vote'),
    ).toHaveLength(1)
    await history(page, language)
    await activate(
      page.getByRole('button', { name: t.voteCorrection.action, exact: true }),
    )
    await expect(
      page.getByRole('region', { name: t.voteCorrection.title }),
    ).toContainText(
      interpolate(t.voteCorrection.summary, { player: 'Bob', votes: 5 }),
    )
    await activate(
      page.getByRole('button', { name: t.common.cancel, exact: true }),
    )
    expect(
      await page.evaluate(() => localStorage.getItem('grimoire_games')),
    ).toBe(raw)
    await activate(
      page.getByRole('button', { name: t.voteCorrection.action, exact: true }),
    )
    const confirmation = page.getByRole('button', {
      name: t.voteCorrection.confirm,
      exact: true,
    })
    expect(
      await confirmation.evaluate(
        (button) => button.scrollWidth <= button.clientWidth,
      ),
    ).toBe(true)
    const box = await confirmation.boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(44)
    expect(box!.width).toBeGreaterThanOrEqual(44)
    await page.screenshot({
      path: info.outputPath(`vote-${language}-confirmation.png`),
      animations: 'disabled',
    })
    await activate(
      page.getByRole('button', { name: t.voteCorrection.confirm, exact: true }),
    )
    let corrected = await saved(page)
    expect(corrected.history.slice(0, -1)).toEqual(changed.history)
    expect(getCurrentState(corrected)).toEqual(op.beforeState)
    await expect(voter(page, 'Ghost')).toBeEnabled()
    await expect(page.locator('nav.game-tools')).toHaveCount(0)
    await page.reload()
    expect(await saved(page)).toEqual(corrected)
    await expect(voter(page, 'Ghost')).toBeEnabled()
    await activate(
      page
        .getByRole('button', { name: t.voteCorrection.back, exact: true })
        .first(),
    )
    await expect(
      page.getByRole('button', { name: t.voteCorrection.action, exact: true }),
    ).toHaveCount(0)
    await activate(
      page.getByRole('button', { name: t.voteCorrection.resume, exact: true }),
    )
    await expect(voter(page, 'Dave')).toBeDisabled()
    await activate(voter(page, 'Bob'))
    await activate(voter(page, 'Dave'))
    await expect(voter(page, 'Dave')).toHaveAttribute('aria-pressed', 'true')
    await activate(voter(page, 'Bob'))
    await expect(voter(page, 'Dave')).toHaveAttribute('aria-pressed', 'false')
    await expect(voter(page, 'Dave')).toBeDisabled()
    for (const name of ['Bob', 'Alice', 'Ghost'])
      await activate(voter(page, name))
    await page.screenshot({
      path: info.outputPath(`vote-${language}-repeat.png`),
      animations: 'disabled',
    })
    await activate(
      page.getByRole('button', { name: t.game.confirmVotes, exact: true }),
    )
    const repeated = await saved(page)
    expect(getBlockStatus(repeated)?.voteCount).toBe(3)
    expect(getVoteBenchmark(repeated)).toBe(3)
    expect(repeated.history.filter((e) => e.type === 'nomination')).toEqual(
      changed.history.filter((e) => e.type === 'nomination'),
    )
    expect(
      getCurrentState(repeated)
        .players.find((p) => p.id === 'g')!
        .effects.filter((e) => e.type === 'used_dead_vote'),
    ).toHaveLength(1)
    await history(page, language)
    await expect(page.locator('body')).toContainText(
      interpolate(t.voteCorrection.history, { player: 'Bob', votes: 5 }),
    )
    await page.screenshot({
      path: info.outputPath(`vote-${language}-audit.png`),
      animations: 'disabled',
    })
    await activate(
      page.getByRole('button', { name: t.common.back, exact: true }),
    )
    await activate(
      page.getByRole('button', {
        name: new RegExp('^' + t.game.newNomination),
      }),
    )
    await expect(
      page.getByRole('button', { name: /^Alice(?: |$)/ }).first(),
    ).toBeDisabled()
    await expect(
      page.getByRole('button', { name: /^Bob(?: |$)/ }).last(),
    ).toBeDisabled()
  })
test('correct an actual two-event tie and execute the prior leader after a lower replacement tally', async ({
  page,
}, info) => {
  await seed(page, withLead())
  await nomination(page, 'en', 'Frank', 'Bob')
  for (const name of ['Bob', 'Alice', 'Carol', 'Ghost'])
    await activate(voter(page, name))
  await activate(
    page.getByRole('button', { name: en.game.confirmVotes, exact: true }),
  )
  const wrong = await saved(page),
    op = getEligibleVoteOperation(wrong)!
  expect(op.eventIds).toHaveLength(2)
  expect(getBlockStatus(wrong)).toBeNull()
  await correction(page)
  const restored = await saved(page)
  expect(getBlockStatus(restored)?.playerId).toBe('a')
  expect(getVoteBenchmark(restored)).toBe(4)
  expect(
    op.eventIds.every(
      (id) => !getEffectiveVoteHistory(restored).some((e) => e.id === id),
    ),
  ).toBe(true)
  for (const name of ['Bob', 'Alice', 'Ghost'])
    await activate(voter(page, name))
  await activate(
    page.getByRole('button', { name: en.game.confirmVotes, exact: true }),
  )
  expect(getBlockStatus(await saved(page))?.playerId).toBe('a')
  await page.screenshot({
    path: info.outputPath('tie-corrected-outcome.png'),
    animations: 'disabled',
  })
  await activate(
    page.getByRole('button', {
      name: interpolate(en.game.endDayExecute, { player: 'Alice' }),
      exact: true,
    }),
  )
  await activate(
    page
      .getByRole('dialog')
      .getByRole('button', { name: en.game.confirmEndDay, exact: true }),
  )
  const result = await saved(page)
  expect(
    getCurrentState(result)
      .players.find((p) => p.id === 'a')!
      .effects.some((e) => e.type === 'dead'),
  ).toBe(true)
  expect(
    getCurrentState(result)
      .players.find((p) => p.id === 'b')!
      .effects.some((e) => e.type === 'dead'),
  ).toBe(false)
})
test('failed saves and stale confirmations cannot publish a correction or reopen voting', async ({
  page,
}) => {
  await seed(page, tied())
  await history(page)
  await activate(
    page.getByRole('button', { name: en.voteCorrection.action, exact: true }),
  )
  const raw = await page.evaluate(() => localStorage.getItem('grimoire_games'))
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Quota', 'QuotaExceededError')
    }
  })
  await activate(
    page.getByRole('button', { name: en.voteCorrection.confirm, exact: true }),
  )
  await expect(page.getByRole('alert')).toHaveText(en.voteCorrection.error)
  await expect(
    page.getByRole('button', { name: en.voteCorrection.confirm }),
  ).toBeDisabled()
  expect(
    await page.evaluate(() => localStorage.getItem('grimoire_games')),
  ).toBe(raw)
  await expect(voter(page, 'Ghost')).toHaveCount(0)
  await page.reload()
  await history(page)
  await activate(
    page.getByRole('button', { name: en.voteCorrection.action, exact: true }),
  )
  const changed = await saved(page),
    later = addHistoryEntry(changed, {
      type: 'effect_added',
      data: { source: 'external' },
      message: [],
    })
  await page.evaluate(
    (game) =>
      localStorage.setItem(
        'grimoire_games',
        JSON.stringify({ version: 1, games: [game] }),
      ),
    later,
  )
  await activate(
    page.getByRole('button', { name: en.voteCorrection.confirm, exact: true }),
  )
  await expect(page.getByRole('alert')).toHaveText(en.voteCorrection.error)
  expect(await saved(page)).toEqual(later)
  await page.reload()
  await history(page)
  await expect(
    page.getByRole('button', { name: en.voteCorrection.action, exact: true }),
  ).toHaveCount(0)
})
test('backup of a cancelled tie restores pending voting, ghost availability and the effective prior lead', async ({
  page,
  browser,
}, info) => {
  const wrong = tied(),
    corrected = correctLatestVote(
      wrong,
      getEligibleVoteOperation(wrong)!.operationId,
    )
  await seed(page, corrected)
  await page.goto('./backup')
  const downloading = page.waitForEvent('download')
  await activate(
    page.getByRole('button', { name: en.backup.download, exact: true }),
  )
  const download = await downloading,
    path = info.outputPath('corrected-vote-backup.json')
  await download.saveAs(path)
  const context = await browser.newContext({
    ...info.project.use,
  } as Parameters<typeof browser.newContext>[0])
  try {
    const target = await context.newPage()
    await target.goto(new URL('backup', page.url().replace(/backup$/, '')).href)
    await target.evaluate(() =>
      localStorage.setItem('grimoire_current_game', 'preserved'),
    )
    await target.getByLabel(pt.backup.file).setInputFiles(path)
    await activate(
      target.getByRole('button', { name: pt.backup.confirm, exact: true }),
    )
    expect(await saved(target)).toEqual(corrected)
    expect(
      await target.evaluate(() =>
        localStorage.getItem('grimoire_current_game'),
      ),
    ).toBe('preserved')
    await target.goto(
      new URL(`game/${corrected.id}`, page.url().replace(/backup$/, '')).href,
    )
    await expect(voter(target, 'Ghost')).toBeEnabled()
    await activate(voter(target, 'Ghost'))
    await activate(
      target.getByRole('button', { name: pt.game.confirmVotes, exact: true }),
    )
    const result = await saved(target)
    expect(getBlockStatus(result)?.playerId).toBe('a')
    expect(getVoteBenchmark(result)).toBe(4)
    expect(result.history.filter((e) => e.type === 'nomination')).toHaveLength(
      2,
    )
  } finally {
    await context.close()
  }
})
test('a public reference and interrupted player-facing recovery never offer vote correction', async ({
  page,
}) => {
  const game = tied()
  await seed(page, game)
  await history(page)
  await activate(
    page.getByRole('button', { name: en.voteCorrection.action, exact: true }),
  )
  await activate(
    page.getByRole('button', { name: en.playerReference.title, exact: true }),
  )
  await expect(
    page.getByRole('button', { name: en.voteCorrection.action, exact: true }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: en.voteCorrection.confirm, exact: true }),
  ).toHaveCount(0)
  expect(await saved(page)).toEqual(game)
  await page.reload()
  await expect(
    page.getByRole('heading', {
      name: en.refinement.recoveryTitle,
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: en.voteCorrection.action, exact: true }),
  ).toHaveCount(0)
})

test('re-recording also refuses to overwrite an independent change from another tab', async ({
  page,
}) => {
  const wrong = tied(),
    corrected = correctLatestVote(
      wrong,
      getEligibleVoteOperation(wrong)!.operationId,
    )
  await seed(page, corrected)
  await activate(voter(page, 'Bob'))
  const later = addHistoryEntry(corrected, {
    type: 'effect_added',
    data: { source: 'other-tab' },
    message: [],
  })
  await page.evaluate(
    (game) =>
      localStorage.setItem(
        'grimoire_games',
        JSON.stringify({ version: 1, games: [game] }),
      ),
    later,
  )
  await activate(
    page.getByRole('button', { name: en.game.confirmVotes, exact: true }),
  )
  await expect(
    page.getByText(en.storageRecovery.unexpected, { exact: true }),
  ).toBeVisible()
  expect(await saved(page)).toEqual(later)
  expect(
    (await saved(page)).history.filter((e) => e.type === 'vote'),
  ).toHaveLength(wrong.history.filter((e) => e.type === 'vote').length)
})
