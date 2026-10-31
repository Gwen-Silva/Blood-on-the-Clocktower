import { test, expect, type Page, type Locator } from '@playwright/test'
import {
  makeGameWithHistory,
  makeStandardPlayers,
} from '../src/lib/__tests__/helpers'
import en from '../src/lib/i18n/translations/en'
import es from '../src/lib/i18n/translations/es'
import pt from '../src/lib/i18n/translations/pt-BR'
const copies = { en, es, 'pt-BR': pt }
function fixture() {
  const players = makeStandardPlayers()
  players[1].effects.push({
    id: 'poison-stable',
    type: 'poisoned',
    sourcePlayerId: players[4].id,
    expiresAt: 'end_of_day',
    data: { source: 'fixture' },
  })
  const game = makeGameWithHistory(
    [
      { type: 'game_created' },
      { type: 'day_started', stateOverrides: { phase: 'day', round: 3 } },
      {
        type: 'vote',
        data: { voterId: players[0].id, targetId: players[1].id },
      },
    ],
    { phase: 'setup', round: 0, winner: null, players },
  )
  game.name = 'Weekend backup'
  game.scriptId = 'trouble-brewing'
  return game
}
async function activate(control: Locator) {
  if (await control.page().evaluate(() => navigator.maxTouchPoints > 0))
    await control.tap()
  else await control.click()
}
async function readGames(page: Page) {
  return page.evaluate(() => {
    const raw = localStorage.getItem('grimoire_games')
    if (raw === null) return []
    const value = JSON.parse(raw)
    return Array.isArray(value) ? value : value.games
  })
}
for (const language of ['pt-BR', 'en', 'es'] as const) {
  test(`${language}: download actual backup, restore into separate browser and continue`, async ({
    page,
    browser,
  }, info) => {
    const t = copies[language],
      game = fixture(),
      other = { ...fixture(), name: 'Second game' }
    await page.goto('./')
    await page.evaluate(
      ({ game, other, language }) => {
        localStorage.setItem(
          'grimoire_games',
          JSON.stringify({ version: 1, games: [game, other] }),
        )
        localStorage.setItem('grimoire_current_game', game.id)
        localStorage.setItem('grimoire_language', language)
      },
      { game, other, language },
    )
    await page.reload()
    const seal = page.getByRole('button', {
      name: t.mainMenu.tapToOpen,
      exact: true,
    })
    if (await seal.count()) await seal.click()
    await page
      .getByRole('button', { name: t.backup.title, exact: true })
      .click()
    await expect(page.getByText(t.backup.secret)).toBeVisible()
    const downloadEvent = page.waitForEvent('download')
    await activate(
      page.getByRole('button', { name: t.backup.download, exact: true }),
    )
    const download = await downloadEvent
    expect(download.suggestedFilename()).toMatch(/^grimorium-backup-.*\.json$/)
    const path = info.outputPath(download.suggestedFilename())
    await download.saveAs(path)
    expect(await readGames(page)).toEqual([game, other])
    const destination = await browser.newContext({
      ...info.project.use,
      baseURL: info.project.use.baseURL,
    } as Parameters<typeof browser.newContext>[0])
    try {
      const target = await destination.newPage()
      await target.goto(new URL('./', page.url()).href)
      await target.evaluate((language) => {
        localStorage.setItem('grimoire_language', language)
        localStorage.setItem('grimoire_current_game', 'preserve-selection')
      }, language)
      await target.goto(
        new URL('backup', page.url().replace(/backup$/, '')).href,
      )
      expect(await readGames(target)).toEqual([])
      const chooserEvent = target.waitForEvent('filechooser')
      await activate(target.getByLabel(t.backup.file, { exact: true }))
      await (await chooserEvent).setFiles(path)
      await expect(
        target.getByRole('heading', {
          name: t.backup.found.replace('{count}', '2'),
        }),
      ).toBeVisible()
      await expect(
        target.getByRole('region', { name: t.backup.restore }),
      ).not.toContainText('Diabrete')
      await expect(
        target.getByRole('region', { name: t.backup.restore }),
      ).not.toContainText('poisoned')
      expect(await readGames(target)).toEqual([])
      await target.screenshot({
        path: info.outputPath(`preview-${language}.png`),
        animations: 'disabled',
      })
      await activate(
        target.getByRole('button', { name: t.backup.confirm, exact: true }),
      )
      await expect(target.getByRole('status')).toHaveText(t.backup.restored)
      expect(await readGames(target)).toEqual([game, other])
      expect(
        await target.evaluate(() =>
          localStorage.getItem('grimoire_current_game'),
        ),
      ).toBe('preserve-selection')
      expect(
        await target.evaluate(() => localStorage.getItem('grimoire_language')),
      ).toBe(language)
      await target.goto(
        new URL(`game/${game.id}`, page.url().replace(/backup$/, '')).href,
      )
      await expect(
        target.getByRole('button', {
          name: t.game.endDayNoExecution,
          exact: true,
        }),
      ).toBeVisible()
      expect((await readGames(target))[0]).toEqual(game)
      await activate(
        target.getByRole('button', {
          name: t.game.endDayNoExecution,
          exact: true,
        }),
      )
      const dialog = target.getByRole('dialog')
      await activate(
        dialog.getByRole('button', { name: t.game.confirmEndDay, exact: true }),
      )
      await expect
        .poll(
          async () =>
            (await readGames(target))[0].history.at(-1).stateAfter.phase,
        )
        .toBe('night')
      const advanced = (await readGames(target))[0]
      expect(advanced.history.slice(0, game.history.length)).toEqual(
        game.history,
      )
      expect(advanced.history.at(-1).stateAfter.round).toBe(4)
      expect(
        advanced.history
          .at(-1)
          .stateAfter.players.map((p: { id: string; roleId: string }) => ({
            id: p.id,
            roleId: p.roleId,
          })),
      ).toEqual(
        game.history
          .at(-1)!
          .stateAfter.players.map((p) => ({ id: p.id, roleId: p.roleId })),
      )
      await target.screenshot({
        path: info.outputPath(`continued-${language}.png`),
        animations: 'disabled',
      })
    } finally {
      await destination.close()
    }
  })
}
test('conflict preview requires a choice; cancel, replace and keep both preserve internal ids', async ({
  page,
}, info) => {
  const t = pt,
    game = fixture(),
    original = { ...game, name: 'Local original' }
  const file = {
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        format: 'grimorium-backup',
        version: 1,
        exportedAt: Date.now(),
        games: [game],
      }),
    ),
  }
  await page.goto('./')
  await page.evaluate((original) => {
    localStorage.setItem('grimoire_games', JSON.stringify([original]))
    localStorage.setItem('grimoire_current_game', original.id)
  }, original)
  await page.goto('./backup')
  const before = await page.evaluate(() =>
    localStorage.getItem('grimoire_games'),
  )
  await page.getByLabel(t.backup.file).setInputFiles(file)
  await expect(
    page.getByRole('button', { name: t.backup.confirm }),
  ).toBeDisabled()
  await expect(page.getByText(t.backup.conflict)).toBeVisible()
  await page.getByLabel(t.backup.choose).selectOption('replace')
  await activate(
    page.getByRole('button', { name: t.common.cancel, exact: true }),
  )
  expect(
    await page.evaluate(() => localStorage.getItem('grimoire_games')),
  ).toBe(before)
  await page.getByLabel(t.backup.file).setInputFiles(file)
  await page.getByLabel(t.backup.choose).selectOption('both')
  await page.screenshot({
    path: info.outputPath('conflict.png'),
    animations: 'disabled',
  })
  await activate(page.getByRole('button', { name: t.backup.confirm }))
  const [local, imported] = await readGames(page)
  expect(local).toEqual(original)
  expect(imported.id).not.toBe(game.id)
  expect({ ...imported, id: game.id }).toEqual(game)
  expect(
    await page.evaluate(() => localStorage.getItem('grimoire_current_game')),
  ).toBe(original.id)
  await page.getByLabel(t.backup.file).setInputFiles(file)
  await page.getByLabel(t.backup.choose).selectOption('replace')
  await activate(page.getByRole('button', { name: t.backup.confirm }))
  expect((await readGames(page))[0]).toEqual(game)
  expect((await readGames(page))[1]).toEqual(imported)
})
test('invalid files, failed storage, and pending privacy recovery cannot alter saved games', async ({
  page,
}) => {
  const t = pt,
    game = fixture()
  await page.goto('./')
  await page.evaluate((game) => {
    localStorage.setItem('grimoire_games', JSON.stringify([game]))
    localStorage.setItem('grimoire_current_game', game.id)
  }, game)
  await page.goto('./backup')
  const before = await page.evaluate(() =>
    localStorage.getItem('grimoire_games'),
  )
  for (const buffer of [
    'broken',
    JSON.stringify({
      format: 'grimorium-backup',
      version: 99,
      exportedAt: Date.now(),
      games: [game],
    }),
    JSON.stringify({
      format: 'grimorium-backup',
      version: 1,
      exportedAt: Date.now(),
      games: [game, { ...game, id: 'broken', history: [] }],
    }),
  ]) {
    await page.getByLabel(t.backup.file).setInputFiles({
      name: 'invalid.json',
      mimeType: 'application/json',
      buffer: Buffer.from(buffer),
    })
    await expect(page.getByRole('status')).toHaveText(t.backup.invalid)
    expect(
      await page.evaluate(() => localStorage.getItem('grimoire_games')),
    ).toBe(before)
  }
  await page.getByLabel(t.backup.file).setInputFiles({
    name: 'valid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        format: 'grimorium-backup',
        version: 1,
        exportedAt: Date.now(),
        games: [fixture()],
      }),
    ),
  })
  await expect(
    page.getByRole('button', { name: t.backup.confirm }),
  ).toBeEnabled()
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Quota', 'QuotaExceededError')
    }
  })
  await activate(page.getByRole('button', { name: t.backup.confirm }))
  await expect(page.getByRole('status')).toHaveText(t.backup.saveError)
  expect(
    await page.evaluate(() => localStorage.getItem('grimoire_games')),
  ).toBe(before)
  await page.reload()
  await page.evaluate(() =>
    localStorage.setItem('grimoire_audience_protected', '1'),
  )
  await page.reload()
  await expect(
    page.getByRole('heading', { name: t.refinement.recoveryTitle }),
  ).toBeVisible()
  await expect(page.getByLabel(t.backup.file)).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: t.backup.download }),
  ).toHaveCount(0)
  expect(
    await page.evaluate(() => localStorage.getItem('grimoire_games')),
  ).toBe(before)
  await page.goBack()
  await expect(page.getByLabel(t.backup.file)).toHaveCount(0)
})

test('sharing uses the complete file and falls back to download when file sharing is unavailable', async ({
  page,
}) => {
  const game = fixture()
  await page.goto('./')
  await page.evaluate(
    (game) => localStorage.setItem('grimoire_games', JSON.stringify([game])),
    game,
  )
  await page.goto('./backup')
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'canShare', {
      configurable: true,
      value: () => true,
    })
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (data: ShareData) => {
        const file = data.files![0]
        document.body.dataset.sharedBackup = await file.text()
      },
    })
  })
  await activate(
    page.getByRole('button', { name: pt.backup.share, exact: true }),
  )
  await expect(page.getByRole('status')).toHaveText(pt.backup.created)
  const shared = await page.evaluate(() =>
    JSON.parse(document.body.dataset.sharedBackup!),
  )
  expect(shared.games).toEqual([game])
  expect(await readGames(page)).toEqual([game])
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'canShare', {
      configurable: true,
      value: () => false,
    }),
  )
  const downloadEvent = page.waitForEvent('download')
  await activate(
    page.getByRole('button', { name: pt.backup.share, exact: true }),
  )
  expect((await downloadEvent).suggestedFilename()).toMatch(/\.json$/)
  expect(await readGames(page)).toEqual([game])
})
