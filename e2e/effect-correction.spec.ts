import { test, expect, type Page, type Locator } from '@playwright/test'
import {
  makeGameWithHistory,
  makeStandardPlayers,
} from '../src/lib/__tests__/helpers'
import { addEffectToPlayer, skipNightAction } from '../src/lib/game'
import {
  recordManualEffectEdit,
  type ManualEffectOperation,
} from '../src/lib/manualEffectCorrection'
import type { Game } from '../src/lib/types'
import en from '../src/lib/i18n/translations/en'
import es from '../src/lib/i18n/translations/es'
import pt from '../src/lib/i18n/translations/pt-BR'
const copies = { en, es, 'pt-BR': pt }
type Language = keyof typeof copies
const effects = {
  en: { poison: 'Poisoned', save: 'Save' },
  es: { poison: 'Envenenado', save: 'Guardar' },
  'pt-BR': { poison: 'Envenenado', save: 'Salvar' },
}
function fixture(
  operation: ManualEffectOperation = 'add',
  phase: 'day' | 'night' | 'setup' = 'day',
) {
  const players = makeStandardPlayers()
  players[0].roleId = 'butler'
  players[3].roleId = 'spy'
  players[3].name = 'Dana'
  players[1].effects = [
    {
      id: 'unrelated-effect',
      type: 'safe',
      data: { nested: ['stable'] },
      sourcePlayerId: 'p3',
      expiresAt: 'never',
    },
  ]
  if (operation === 'remove')
    players[0].effects = [
      {
        id: 'original-poison',
        type: 'poisoned',
        data: { reason: 'original' },
        sourcePlayerId: 'p5',
        expiresAt: 'end_of_day',
      },
    ]
  if (operation === 'update')
    players[0].effects = [
      {
        id: 'original-master',
        type: 'butler_master',
        data: { masterId: 'p2', other: { stable: true } },
        sourcePlayerId: 'p1',
        expiresAt: 'end_of_night',
      },
    ]
  return makeGameWithHistory(
    phase === 'setup'
      ? [{ type: 'game_created' }]
      : [
          { type: 'game_created' },
          {
            type: phase === 'day' ? 'day_started' : 'night_started',
            stateOverrides: { phase, round: 2 },
          },
        ],
    { phase: 'setup', round: 0, players, winner: null },
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
    const value = JSON.parse(localStorage.getItem('grimoire_games')!)
    return (Array.isArray(value) ? value : value.games)[0]
  })
}
async function manualEdit(
  page: Page,
  operation: ManualEffectOperation,
  language: Language = 'en',
) {
  const t = copies[language]
  await activate(
    page
      .locator('nav.game-tools')
      .getByRole('button', { name: t.game.grimoire, exact: true }),
  )
  const dialog = page.getByRole('dialog')
  await activate(dialog.getByRole('button', { name: /^Alice / }))
  await activate(
    dialog.getByRole('button', { name: t.ui.editEffects, exact: true }),
  )
  if (operation === 'add')
    await activate(
      dialog.getByRole('button', {
        name: effects[language].poison,
        exact: true,
      }),
    )
  else if (operation === 'remove')
    await activate(dialog.locator('button:has(svg.lucide-minus)'))
  else {
    await activate(dialog.locator('button:has(svg.lucide-pencil)'))
    await activate(
      dialog
        .getByRole('button', { name: 'Clara', exact: true })
        .or(dialog.getByRole('button', { name: 'Carol', exact: true })),
    )
    await activate(
      dialog.getByRole('button', { name: effects[language].save, exact: true }),
    )
  }
  await activate(dialog.getByRole('button', { name: t.ui.close, exact: true }))
  await activate(
    page
      .locator('nav.game-tools')
      .getByRole('button', { name: t.common.history, exact: true }),
  )
  await expect(
    page.getByRole('button', { name: t.effectCorrection.action, exact: true }),
  ).toBeVisible()
  return saved(page)
}
for (const language of ['pt-BR', 'en', 'es'] as const)
  test(`${language}: correct manual add/remove/configuration, preserve audit and reload`, async ({
    page,
  }, info) => {
    const t = copies[language]
    for (const operation of ['add', 'remove', 'update'] as const) {
      const original = fixture(operation)
      await seed(page, original, language)
      const changed = await manualEdit(page, operation, language)
      expect(changed.history.at(-1)!.data.manualEffectEdit).toBeTruthy()
      const before = await page.evaluate(() =>
        localStorage.getItem('grimoire_games'),
      )
      await activate(
        page.getByRole('button', {
          name: t.effectCorrection.action,
          exact: true,
        }),
      )
      await expect(
        page.getByRole('region', { name: t.effectCorrection.title }),
      ).toContainText('Alice')
      await expect(page.getByText(t.effectCorrection.limit)).toBeVisible()
      await activate(
        page.getByRole('button', { name: t.common.cancel, exact: true }),
      )
      expect(
        await page.evaluate(() => localStorage.getItem('grimoire_games')),
      ).toBe(before)
      await activate(
        page.getByRole('button', {
          name: t.effectCorrection.action,
          exact: true,
        }),
      )
      await page.screenshot({
        path: info.outputPath(`${language}-${operation}-confirmation.png`),
        animations: 'disabled',
      })
      await activate(
        page.getByRole('button', {
          name: t.effectCorrection.confirm,
          exact: true,
        }),
      )
      await expect(
        page.getByRole('button', {
          name: t.effectCorrection.action,
          exact: true,
        }),
      ).toHaveCount(0)
      const corrected = await saved(page)
      expect(corrected.history.slice(0, -1)).toEqual(changed.history)
      expect(corrected.history.at(-1)!.type).toBe('effect_corrected')
      expect(corrected.history.at(-1)!.data.originalEventId).toBe(
        changed.history.at(-1)!.id,
      )
      expect(corrected.history.at(-1)!.stateAfter).toEqual(
        original.history.at(-1)!.stateAfter,
      )
      await expect(page.locator('body')).toContainText(
        t.effectCorrection.history.split('{effect}')[0],
      )
      await page.reload()
      expect(await saved(page)).toEqual(corrected)
      await activate(
        page
          .locator('nav.game-tools')
          .getByRole('button', { name: t.common.history, exact: true }),
      )
      await expect(
        page.getByRole('button', {
          name: t.effectCorrection.action,
          exact: true,
        }),
      ).toHaveCount(0)
      if (operation === 'add')
        await page.screenshot({
          path: info.outputPath(`${language}-corrected-history.png`),
          animations: 'disabled',
        })
    }
  })
test('failed correction leaves the displayed and stored game unchanged; later events are ineligible', async ({
  page,
}) => {
  const original = fixture()
  await seed(page, original)
  const changed = await manualEdit(page, 'add'),
    raw = await page.evaluate(() => localStorage.getItem('grimoire_games'))
  await activate(
    page.getByRole('button', { name: en.effectCorrection.action, exact: true }),
  )
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Quota', 'QuotaExceededError')
    }
  })
  await activate(
    page.getByRole('button', {
      name: en.effectCorrection.confirm,
      exact: true,
    }),
  )
  await expect(page.getByRole('alert')).toHaveText(en.effectCorrection.error)
  await expect(
    page.getByRole('button', { name: en.effectCorrection.confirm }),
  ).toBeDisabled()
  expect(
    await page.evaluate(() => localStorage.getItem('grimoire_games')),
  ).toBe(raw)
  expect(await saved(page)).toEqual(changed)
  await page.reload()
  await activate(
    page.getByRole('button', { name: en.game.endDayNoExecution, exact: true }),
  )
  await activate(
    page
      .getByRole('dialog')
      .getByRole('button', { name: en.game.confirmEndDay, exact: true }),
  )
  await activate(
    page
      .locator('nav.game-tools')
      .getByRole('button', { name: en.common.history, exact: true }),
  )
  await expect(
    page.getByRole('button', { name: en.effectCorrection.action, exact: true }),
  ).toHaveCount(0)
  expect(
    (await saved(page)).history.some(
      (entry) => entry.type === 'effect_corrected',
    ),
  ).toBe(false)
})
test('corrected history and state survive an actual backup download and restore in an empty browser', async ({
  page,
  browser,
}, info) => {
  await seed(page, fixture())
  await manualEdit(page, 'add')
  await activate(
    page.getByRole('button', { name: en.effectCorrection.action, exact: true }),
  )
  await activate(
    page.getByRole('button', {
      name: en.effectCorrection.confirm,
      exact: true,
    }),
  )
  const corrected = await saved(page)
  await page.goto('./backup')
  const downloading = page.waitForEvent('download')
  await activate(
    page.getByRole('button', { name: en.backup.download, exact: true }),
  )
  const download = await downloading,
    path = info.outputPath('corrected-backup.json')
  await download.saveAs(path)
  const context = await browser.newContext({
    ...info.project.use,
  } as Parameters<typeof browser.newContext>[0])
  try {
    const target = await context.newPage()
    await target.goto(new URL('backup', page.url().replace(/backup$/, '')).href)
    await target.getByLabel(pt.backup.file).setInputFiles(path)
    await activate(
      target.getByRole('button', { name: pt.backup.confirm, exact: true }),
    )
    expect(await saved(target)).toEqual(corrected)
    await target.goto(
      new URL(`game/${corrected.id}`, page.url().replace(/backup$/, '')).href,
    )
    await expect(
      target.getByRole('button', {
        name: pt.game.endDayNoExecution,
        exact: true,
      }),
    ).toBeVisible()
    await activate(
      target
        .locator('nav.game-tools')
        .getByRole('button', { name: pt.common.history, exact: true }),
    )
    await expect(target.locator('body')).toContainText(
      pt.effectCorrection.history.split('{effect}')[0],
    )
    await expect(
      target.getByRole('button', {
        name: pt.effectCorrection.action,
        exact: true,
      }),
    ).toHaveCount(0)
  } finally {
    await context.close()
  }
})
test('eligible correction controls never appear in public reference, private role reveal or Spy viewing', async ({
  browser,
}, info) => {
  for (const audience of ['reference', 'role', 'spy'] as const) {
    const context = await browser.newContext({
      ...info.project.use,
    } as Parameters<typeof browser.newContext>[0])
    try {
      const page = await context.newPage()
      let original = fixture(
        'add',
        audience === 'spy' ? 'night' : audience === 'role' ? 'setup' : 'day',
      )
      if (audience === 'spy')
        original = skipNightAction(
          skipNightAction(original, 'imp', 'p5'),
          'butler',
          'p1',
        )
      const game = recordManualEffectEdit(
        original,
        addEffectToPlayer(original, 'p1', 'poisoned'),
        'add',
      )
      await seed(page, game)
      if (audience === 'reference')
        await activate(
          page.getByRole('button', {
            name: en.playerReference.title,
            exact: true,
          }),
        )
      else if (audience === 'role') {
        await activate(page.getByRole('button', { name: /Alice/ }).first())
        await activate(
          page.getByRole('button', {
            name: /Ready to Look|Tap when they are ready to look/i,
          }),
        )
      } else {
        await activate(
          page.getByRole('button', { name: /Spy.*Dana|Dana.*Spy/ }).first(),
        )
        await activate(
          page.getByRole('button', {
            name: /View Grimoire/,
          }),
        )
        await activate(
          page.getByRole('button', {
            name: /Ready to Look|Tap when they are ready to look/i,
          }),
        )
      }
      await expect(
        page.getByRole('button', {
          name: en.effectCorrection.action,
          exact: true,
        }),
      ).toHaveCount(0)
      await expect(
        page.getByRole('button', {
          name: en.voteCorrection.action,
          exact: true,
        }),
      ).toHaveCount(0)
      await expect(page.locator('nav.game-tools')).toHaveCount(0)
      expect(await saved(page)).toEqual(game)
      await page.reload()
      await expect(
        page.getByRole('heading', {
          name: en.refinement.recoveryTitle,
          exact: true,
        }),
      ).toBeVisible()
      await expect(
        page.getByRole('button', {
          name: en.effectCorrection.action,
          exact: true,
        }),
      ).toHaveCount(0)
      await expect(
        page.getByRole('button', {
          name: en.voteCorrection.action,
          exact: true,
        }),
      ).toHaveCount(0)
    } finally {
      await context.close()
    }
  }
})

test('a latest manual dead marker can be corrected after reload without undoing a recorded game end', async ({
  page,
}) => {
  const original = fixture(),
    changed = recordManualEffectEdit(
      original,
      addEffectToPlayer(original, 'p5', 'dead'),
      'add',
    )
  await seed(page, changed)
  await activate(
    page.getByRole('button', { name: en.common.history, exact: true }),
  )
  await activate(
    page.getByRole('button', { name: en.effectCorrection.action, exact: true }),
  )
  await activate(
    page.getByRole('button', {
      name: en.effectCorrection.confirm,
      exact: true,
    }),
  )
  expect((await saved(page)).history.at(-1)!.stateAfter).toEqual(
    original.history.at(-1)!.stateAfter,
  )
  await activate(
    page.getByRole('button', { name: en.common.back, exact: true }),
  )
  await expect(
    page.getByRole('button', { name: en.game.endDayNoExecution, exact: true }),
  ).toBeVisible()
  expect(
    (await saved(page)).history.some((entry) => entry.type === 'game_ended'),
  ).toBe(false)
})
