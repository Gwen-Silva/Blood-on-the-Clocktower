import { test, expect, type Page, type Locator } from '@playwright/test'
import { makeGame, makePlayer, makeState } from '../src/lib/__tests__/helpers'
import en from '../src/lib/i18n/translations/en'
import es from '../src/lib/i18n/translations/es'
import pt from '../src/lib/i18n/translations/pt-BR'
const copies = { en, es, 'pt-BR': pt }
type Language = keyof typeof copies
function fixture(phase: 'setup' | 'night' | 'day' = 'day') {
  const players = ['investigator', 'spy', 'soldier', 'chef', 'imp'].map(
    (roleId, index) =>
      makePlayer({
        id: `seat-${index}`,
        roleId,
        name: ['Reader', 'Alice', 'Bob', 'Clara', 'Demon'][index],
      }),
  )
  const game = makeGame(
    makeState({
      phase,
      round: phase === 'setup' ? 0 : phase === 'night' ? 1 : 2,
      players,
    }),
  )
  game.scriptId = 'trouble-brewing'
  return game
}
async function seed(
  page: Page,
  language: Language,
  phase: 'setup' | 'night' | 'day' = 'day',
) {
  const game = fixture(phase)
  await page.addInitScript(
    ({ game, language }) => {
      localStorage.setItem('grimoire_language', language)
      if (!localStorage.getItem('grimoire_games'))
        localStorage.setItem(
          'grimoire_games',
          JSON.stringify({ version: 1, games: [game] }),
        )
    },
    { game, language },
  )
  return game
}
async function activate(page: Page, control: Locator) {
  if (await page.evaluate(() => navigator.maxTouchPoints > 0))
    await control.tap()
  else await control.click()
}
async function hold(page: Page, language: Language) {
  const button = page.getByRole('button', {
    name: copies[language].game.returnDeviceReady,
    exact: true,
  })
  await button.focus()
  await page.keyboard.down('Space')
  await expect(button).toHaveCount(0)
  await page.keyboard.up('Space')
}

for (const language of ['pt-BR', 'es', 'en'] as const)
  test(`game toolbar is one row with accessible 44px controls in ${language}`, async ({
    page,
  }, info) => {
    const game = await seed(page, language)
    await page.goto(`./game/${game.id}`)
    const nav = page.locator('nav.game-tools')
    await expect(nav).toBeVisible()
    const boxes = await nav.locator(':scope > button').evaluateAll((buttons) =>
      buttons.map((button) => {
        const r = button.getBoundingClientRect()
        return {
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          name:
            button.getAttribute('aria-label') ||
            button.getAttribute('title') ||
            button.textContent,
        }
      }),
    )
    expect(boxes).toHaveLength(4)
    const centers = boxes.map((box) => box.y + box.height / 2)
    expect(Math.max(...centers) - Math.min(...centers)).toBeLessThan(2)
    for (const box of boxes) {
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width)
    }
    await expect(
      page.getByRole('button', {
        name: copies[language].playerReference.title,
        exact: true,
      }),
    ).toBeVisible()
    await expect(
      nav.getByRole('button', {
        name: copies[language].game.grimoire,
        exact: true,
      }),
    ).toBeVisible()
    await expect(
      nav.getByRole('button', {
        name: copies[language].common.history,
        exact: true,
      }),
    ).toBeVisible()
    expect(await nav.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
      true,
    )
    const geometry = await page
      .locator('.game-content')
      .evaluate((el) => el.getBoundingClientRect().top)
    expect(geometry).toBeGreaterThanOrEqual(
      (await nav.boundingBox())!.y + (await nav.boundingBox())!.height - 1,
    )
    await page.screenshot({
      path: info.outputPath(`toolbar-${language}.png`),
      animations: 'disabled',
    })
    const night = fixture('night')
    await page.evaluate(
      (game) => localStorage.setItem('grimoire_games', JSON.stringify([game])),
      night,
    )
    await page.goto(`./game/${night.id}`)
    await page
      .getByRole('button', { name: /Reader/ })
      .first()
      .click()
    await expect(
      page.getByRole('button', {
        name: copies[language].common.back,
        exact: true,
      }),
    ).toBeVisible()
    const nightBounds = await nav
      .locator(':scope > button')
      .evaluateAll((buttons) =>
        buttons.map((button) => {
          const r = button.getBoundingClientRect()
          return { x: r.x, y: r.y, width: r.width, height: r.height }
        }),
      )
    expect(nightBounds).toHaveLength(4)
    const nightCenters = nightBounds.map((box) => box.y + box.height / 2)
    expect(Math.max(...nightCenters) - Math.min(...nightCenters)).toBeLessThan(
      2,
    )
    for (const box of nightBounds) {
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width)
    }
  })

test('startup distinguishes clean, completed and interrupted sessions without clearing protection', async ({
  page,
  context,
}, info) => {
  await page.goto('./')
  await expect(
    page.getByRole('button', { name: pt.mainMenu.tapToOpen, exact: true }),
  ).toBeVisible()
  expect(
    await page.evaluate(() =>
      localStorage.getItem('grimoire_audience_protected'),
    ),
  ).toBeNull()
  const game = await seed(page, 'en')
  await page.goto(`./game/${game.id}`)
  await page
    .getByRole('button', { name: en.playerReference.title, exact: true })
    .click()
  await page.goto('./')
  await expect(
    page.getByRole('heading', {
      name: en.refinement.recoveryTitle,
      exact: true,
    }),
  ).toBeVisible()
  await expect(page.locator('body')).not.toContainText('Reader')
  const button = page.getByRole('button', {
    name: en.game.returnDeviceReady,
    exact: true,
  })
  await button.click()
  expect(
    await page.evaluate(() =>
      localStorage.getItem('grimoire_audience_protected'),
    ),
  ).toBe('1')
  await button.focus()
  await page.keyboard.down('Space')
  await page.waitForTimeout(500)
  await page.keyboard.up('Space')
  expect(
    await page.evaluate(() =>
      localStorage.getItem('grimoire_audience_protected'),
    ),
  ).toBe('1')
  await page.reload()
  await expect(
    page.getByRole('heading', {
      name: en.refinement.recoveryTitle,
      exact: true,
    }),
  ).toBeVisible()
  await page.screenshot({
    path: info.outputPath('startup-recovery.png'),
    animations: 'disabled',
  })
  await hold(page, 'en')
  expect(
    await page.evaluate(() =>
      localStorage.getItem('grimoire_audience_protected'),
    ),
  ).toBeNull()
  const reopened = await context.newPage()
  await reopened.goto(new URL('./', page.url()).href)
  await expect(
    reopened.getByRole('heading', {
      name: en.refinement.recoveryTitle,
      exact: true,
    }),
  ).toHaveCount(0)
  await expect(reopened.locator('.game-shell')).toBeVisible()
  await reopened.close()
})

test('completed revelation has a check and accessible repeat action, with no long visible instruction', async ({
  page,
}, info) => {
  const game = await seed(page, 'en', 'setup')
  await page.goto(`./game/${game.id}`)
  const row = page.getByRole('button', { name: /Reader/ }).first()
  await row.click()
  await page
    .getByRole('button', { name: en.game.tapWhenReady, exact: true })
    .click()
  await page
    .getByRole('button', { name: en.common.iUnderstandMyRole, exact: true })
    .click()
  await hold(page, 'en')
  const completed = page.getByRole('button', {
    name: /Reader.*shown|Reader.*revealed/i,
  })
  await expect(completed).toBeVisible()
  await expect(completed).toHaveAttribute(
    'aria-label',
    new RegExp(
      en.game.revealedShowAgain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    ),
  )
  await expect(completed).not.toContainText(en.game.revealedShowAgain)
  await expect(completed.locator('.text-emerald-500')).toBeVisible()
  const saved = await page.evaluate(() =>
    localStorage.getItem('grimoire_games'),
  )
  await page.screenshot({
    path: info.outputPath('revelation-completed.png'),
    animations: 'disabled',
  })
  await activate(page, completed)
  await expect(
    page.getByRole('button', { name: en.game.tapWhenReady, exact: true }),
  ).toBeVisible()
  expect(
    await page.evaluate(() =>
      localStorage.getItem('grimoire_audience_protected'),
    ),
  ).toBe('1')
  expect(
    await page.evaluate(() => localStorage.getItem('grimoire_games')),
  ).toBe(saved)
})

for (const language of ['pt-BR', 'es', 'en'] as const)
  test(`${language} candidate result expander toggles by touch and keyboard without ending the action`, async ({
    page,
  }, info) => {
    const t = copies[language],
      spy = { en: 'Spy', es: 'Espía', 'pt-BR': 'Espião' }[language]
    const game = await seed(page, language, 'night')
    await page.goto(`./game/${game.id}`)
    await page
      .getByRole('button', { name: /Reader/ })
      .first()
      .click()
    await page
      .getByRole('button')
      .filter({ hasText: t.game.stepSelectPlayers })
      .click()
    await page.getByRole('button', { name: /Alice/ }).click()
    await page.getByRole('button', { name: /Bob/ }).click()
    await page
      .getByRole('button', { name: new RegExp('^' + spy + ' ') })
      .click()
    await page
      .getByRole('button', { name: t.common.confirm, exact: true })
      .click()
    await page
      .getByRole('button')
      .filter({ hasText: t.game.stepShowResult })
      .click()
    await page
      .getByRole('button', { name: t.game.tapWhenReady, exact: true })
      .click()
    const candidates = page.getByRole('heading', { level: 1 }).first(),
      result = page.getByRole('heading', { level: 2 }).first()
    await expect(candidates).toContainText('Alice')
    await expect(candidates).toContainText('Bob')
    await expect(result).toContainText(spy)
    const saved = await page.evaluate(() =>
      localStorage.getItem('grimoire_games'),
    )
    const toggle = page
      .locator('button[aria-expanded][aria-controls]')
      .filter({ hasText: spy })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await page.screenshot({
      path: info.outputPath(`result-collapsed-${language}.png`),
      animations: 'disabled',
    })
    for (let i = 0; i < 2; i++) {
      await activate(page, toggle)
      const hide = page.getByRole('button', {
        name: t.refinement.hideCharacter,
        exact: true,
      })
      await expect(hide).toHaveAttribute('aria-expanded', 'true')
      await page.addStyleTag({
        content: '.animate-card-float{animation:none!important}',
      })
      await expect(
        page.getByRole('heading', { name: spy, exact: true }),
      ).toBeVisible()
      if (i === 0)
        await page.screenshot({
          path: info.outputPath(`result-expanded-${language}.png`),
          animations: 'disabled',
        })
      await hide.press('Enter')
      await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    }
    expect(
      await page.evaluate(() => localStorage.getItem('grimoire_games')),
    ).toBe(saved)
    await expect(candidates).toContainText('Alice')
    await expect(result).toContainText(spy)
    await expect(
      page.locator('[title="Grimoire"],[title="Grimório"],[title="Grimorio"]'),
    ).toHaveCount(0)
    await page
      .getByRole('button', { name: t.common.continue, exact: true })
      .click()
    const holdButton = page.getByRole('button', {
      name: t.game.returnDeviceReady,
      exact: true,
    })
    await expect(holdButton).toBeVisible()
    expect(
      await page.evaluate(() => localStorage.getItem('grimoire_games')),
    ).toBe(saved)
    await hold(page, language)
  })

test('all 23 characters in three languages expose only supplementary rules and keep wiki references', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'mobile-390',
    'Full semantic catalog is checked once; other viewports exercise panels in W06 regressions.',
  )
  test.setTimeout(180000)
  const ids = [
    'imp',
    'baron',
    'butler',
    'chef',
    'drunk',
    'empath',
    'fortune_teller',
    'investigator',
    'librarian',
    'mayor',
    'monk',
    'poisoner',
    'ravenkeeper',
    'recluse',
    'saint',
    'scarlet_woman',
    'slayer',
    'soldier',
    'spy',
    'undertaker',
    'virgin',
    'washerwoman',
    'villager',
  ]
  await page.goto('./')
  for (const language of ['pt-BR', 'es', 'en'] as const) {
    await page.evaluate(
      (language) => localStorage.setItem('grimoire_language', language),
      language,
    )
    for (const id of ids) {
      await page.goto(`./roles/${id}`)
      await page.addStyleTag({
        content: '.animate-card-float{animation:none!important}',
      })
      const ability = await page
        .locator('.role-card-ability > p')
        .last()
        .innerText()
      await page
        .getByRole('button', {
          name: copies[language].clarity.rules,
          exact: true,
        })
        .click()
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      await expect(dialog).not.toContainText(ability)
      await expect(dialog.locator('[data-supplementary-rule]')).not.toHaveCount(
        0,
      )
      if (id !== 'villager') {
        await dialog.getByRole('link').scrollIntoViewIfNeeded()
        await expect(dialog.getByRole('link')).toHaveAttribute(
          'rel',
          'noopener noreferrer',
        )
      } else await expect(dialog.getByRole('link')).toHaveCount(0)
      if (['imp', 'chef', 'slayer'].includes(id))
        await dialog.screenshot({
          path: info.outputPath(`rules-${language}-${id}.png`),
          animations: 'disabled',
        })
    }
  }
})
