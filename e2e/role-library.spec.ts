import { test, expect, type Page } from '@playwright/test'
import { makeGame, makePlayer, makeState } from '../src/lib/__tests__/helpers'

const teams = {
  townsfolk: [
    'washerwoman',
    'librarian',
    'investigator',
    'chef',
    'empath',
    'fortune_teller',
    'undertaker',
    'monk',
    'ravenkeeper',
    'soldier',
    'virgin',
    'slayer',
    'mayor',
  ],
  outsider: ['saint', 'recluse', 'drunk', 'butler'],
  minion: ['scarlet_woman', 'poisoner', 'baron', 'spy'],
  demon: ['imp'],
}
const category = (page: Page, id: string) =>
  page.locator(`[data-category="${id}"]`)
const role = (page: Page, id: string) => page.locator(`[data-role-id="${id}"]`)
const region = (page: Page) => page.locator('.role-library-scroll')
const back = (page: Page) => page.locator('.screen-navigation button').first()
async function chooseCategory(page: Page, id: string) {
  if (await page.locator('.role-category-grid').count())
    await category(page, id).click()
  else await page.locator('.role-library-scroll select').selectOption(id)
}
async function scrollToMayor(page: Page) {
  await region(page).hover()
  await page.mouse.wheel(0, 10000)
  await expect
    .poll(() => region(page).evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0)
  await expect
    .poll(() =>
      region(page).evaluate(
        (el) => el.scrollTop + el.clientHeight >= el.scrollHeight - 2,
      ),
    )
    .toBe(true)
  return region(page).evaluate((el) => el.scrollTop)
}
async function noPrivateData(page: Page) {
  await expect(page.locator('body')).not.toContainText('SECRET_')
  await expect(
    page.locator('[title="Grimoire"],[title="History"]'),
  ).toHaveCount(0)
}

test('standalone restores category, exact native scroll and focus through routed Back/Forward', async ({
  page,
}, info) => {
  await page.addInitScript(() =>
    localStorage.setItem('grimoire_language', 'pt-BR'),
  )
  await page.goto('./roles')
  await expect(page.locator('.role-category-grid button')).toHaveCount(4)
  for (const [id, roles] of Object.entries(teams))
    await expect(category(page, id)).toContainText(String(roles.length))
  await page.screenshot({
    path: info.outputPath('categories.png'),
    animations: 'disabled',
  })
  for (const [id, ids] of Object.entries(teams)) {
    await chooseCategory(page, id)
    await expect(page.locator('[data-role-id]')).toHaveCount(ids.length)
    for (const id of ids) await expect(role(page, id)).toHaveCount(1)
  }
  await chooseCategory(page, 'townsfolk')
  const offset = await scrollToMayor(page)
  await page.screenshot({
    path: info.outputPath('scrolled-category.png'),
    animations: 'disabled',
  })
  await role(page, 'mayor').click()
  await expect(
    page.getByRole('heading', { name: 'Prefeito', exact: true }),
  ).toBeVisible()
  await back(page).click()
  await expect(role(page, 'mayor')).toBeFocused()
  await expect
    .poll(() => region(page).evaluate((el) => el.scrollTop))
    .toBe(offset)
  await expect(role(page, 'mayor')).toHaveAttribute('aria-current', 'true')
  await page.goForward()
  await expect(
    page.getByRole('heading', { name: 'Prefeito', exact: true }),
  ).toBeVisible()
  await page.goBack()
  await expect(role(page, 'mayor')).toBeFocused()
  await expect
    .poll(() => region(page).evaluate((el) => el.scrollTop))
    .toBe(offset)
  for (let i = 0; i < 3; i++) {
    await role(page, 'mayor').click()
    await back(page).click()
    await expect
      .poll(() => region(page).evaluate((el) => el.scrollTop))
      .toBe(offset)
  }
  await page.screenshot({
    path: info.outputPath('restored-category.png'),
    animations: 'disabled',
  })
  const historyLength = await page.evaluate(() => history.length)
  await chooseCategory(page, 'minion')
  await chooseCategory(page, 'outsider')
  await chooseCategory(page, 'townsfolk')
  expect(await page.evaluate(() => history.length)).toBe(historyLength)
  await expect
    .poll(() => region(page).evaluate((el) => el.scrollTop))
    .toBe(offset)
  await page
    .getByRole('button', { name: 'Português (Brasil)', exact: true })
    .click()
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Townsfolk', exact: true }),
  ).toBeVisible()
  await expect(role(page, 'mayor')).toHaveAttribute('aria-current', 'true')
  await role(page, 'mayor').click()
  await page
    .getByRole('button', { name: 'Next character', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Washerwoman', exact: true }),
  ).toBeVisible()
  await back(page).click()
  await expect(role(page, 'washerwoman')).toBeFocused()
  await back(page).click()
  await expect(page.locator('.role-category-grid')).toBeVisible()
  await expect(category(page, 'townsfolk')).toBeFocused()
  await page.goForward()
  await expect(
    page.getByRole('heading', { name: 'Townsfolk', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await page.getByRole('button', { name: 'Español', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Aldeanos', exact: true }),
  ).toBeVisible()
  await expect(role(page, 'washerwoman')).toHaveAttribute(
    'aria-current',
    'true',
  )
  await role(page, 'librarian').click()
  await expect(
    page.getByRole('heading', { name: 'Bibliotecario', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Español', exact: true }).click()
  await page
    .getByRole('button', { name: 'Português (Brasil)', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Bibliotecário', exact: true }),
  ).toBeVisible()
  await back(page).click()
  await expect(role(page, 'librarian')).toBeFocused()
})

test('direct character links infer categories and custom Villager stays reachable', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('grimoire_language', 'pt-BR'),
  )
  await page.goto('./')
  await page
    .getByRole('button', { name: 'Toque para abrir', exact: true })
    .click()
  await page.getByRole('button', { name: /Biblioteca de personagens/i }).click()
  await expect(page.locator('.role-category-grid')).toBeVisible()
  const length = await page.evaluate(() => history.length)
  await back(page).click()
  await expect(
    page.getByRole('button', { name: /Nova partida/i }),
  ).toBeVisible()
  expect(await page.evaluate(() => history.length)).toBe(length)
  await page.goForward()
  await expect(page.locator('.role-category-grid')).toBeVisible()
  await page.goto('./roles/villager')
  await expect(
    page.getByRole('heading', { name: 'Aldeão', exact: true }),
  ).toBeVisible()
  await page.goBack()
  await expect(page.locator('[data-role-id]')).toHaveCount(14)
  await expect(role(page, 'villager')).toHaveCount(1)
  await role(page, 'librarian').click()
  await expect(
    page.getByRole('heading', { name: 'Bibliotecário', exact: true }),
  ).toBeVisible()
  await back(page).click()
  await back(page).click()
  await expect(page.locator('.role-category-grid')).toBeVisible()
  await page.goto('./roles/imp')
  await expect(
    page.getByRole('button', { name: 'Próximo personagem', exact: true }),
  ).toBeDisabled()
  await back(page).click()
  await expect(page.locator('[data-role-id]')).toHaveCount(1)
  await back(page).click()
  await page.setViewportSize({ width: 360, height: 800 })
  await page.addStyleTag({ content: ':root { font-size: 200% }' })
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true)
  await chooseCategory(page, 'townsfolk')
  await expect
    .poll(() => region(page).evaluate((el) => el.scrollWidth <= el.clientWidth))
    .toBe(true)
  await scrollToMayor(page)
  await role(page, 'mayor').click()
  await expect(
    page.getByRole('heading', { name: 'Prefeito', exact: true }),
  ).toBeVisible()
})

test('public Player Reference restores browsing and only exits through protected handback', async ({
  page,
}, info) => {
  const game = makeGame(
    makeState({
      phase: 'day',
      round: 2,
      players: ['soldier', 'chef', 'monk', 'poisoner', 'imp'].map(
        (roleId, index) => makePlayer({ roleId, name: `SECRET_${index}` }),
      ),
    }),
  )
  game.name = 'SECRET_GAME'
  game.scriptId = 'trouble-brewing'
  await page.addInitScript((game) => {
    localStorage.setItem('grimoire_language', 'en')
    localStorage.setItem(
      'grimoire_games',
      JSON.stringify({ version: 1, games: [game] }),
    )
  }, game)
  await page.goto(`./game/${game.id}`)
  await page
    .getByRole('button', { name: 'Player Reference', exact: true })
    .click()
  await noPrivateData(page)
  const saved = await page.evaluate(() =>
    localStorage.getItem('grimoire_games'),
  )
  await chooseCategory(page, 'townsfolk')
  const offset = await scrollToMayor(page)
  await role(page, 'mayor').click()
  await expect(
    page.getByRole('heading', { name: 'Mayor', exact: true }),
  ).toBeVisible()
  await noPrivateData(page)
  await page.addStyleTag({
    content: '.animate-card-float{animation:none!important}',
  })
  await page.getByRole('button', { name: 'View rules', exact: true }).click()
  await page.goBack()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(
    page.getByRole('heading', { name: 'Mayor', exact: true }),
  ).toBeVisible()
  await page.goBack()
  await expect(role(page, 'mayor')).toBeFocused()
  await expect
    .poll(() => region(page).evaluate((el) => el.scrollTop))
    .toBe(offset)
  await page.goForward()
  await expect(
    page.getByRole('heading', { name: 'Mayor', exact: true }),
  ).toBeVisible()
  await back(page).click()
  await expect(role(page, 'mayor')).toBeFocused()
  await expect
    .poll(() => region(page).evaluate((el) => el.scrollTop))
    .toBe(offset)
  await page.screenshot({
    path: info.outputPath('public-reference-restored.png'),
    animations: 'disabled',
  })
  expect(
    await page.evaluate(() => localStorage.getItem('grimoire_games')),
  ).toBe(saved)
  await back(page).click()
  await expect(page.locator('.role-category-grid')).toBeVisible()
  await page.goBack()
  const hold = page.getByRole('button', {
    name: 'Hold to return to Storyteller',
    exact: true,
  })
  await expect(hold).toBeVisible()
  await expect(page.locator('body')).not.toContainText('SECRET_')
  await hold.click()
  await expect(hold).toBeVisible()
  await hold.focus()
  await page.keyboard.down('Space')
  await page.waitForTimeout(400)
  await page.keyboard.up('Space')
  await expect(hold).toBeVisible()
  await page.keyboard.down('Space')
  await expect(hold).toHaveCount(0)
  await page.keyboard.up('Space')
  await expect(
    page.getByRole('button', { name: 'Player Reference', exact: true }),
  ).toBeVisible()
  await expect(page.locator('[title="Grimoire"]')).toHaveCount(1)
  expect(
    await page.evaluate(() => localStorage.getItem('grimoire_games')),
  ).toBe(saved)
  await page
    .getByRole('button', { name: 'Player Reference', exact: true })
    .click()
  await chooseCategory(page, 'demon')
  await role(page, 'imp').click()
  await page
    .getByRole('button', { name: 'Return to Storyteller', exact: true })
    .click()
  await expect(hold).toBeVisible()
  await page.goForward()
  await expect(hold).toBeVisible()
  await expect(page.locator('body')).not.toContainText('SECRET_')
})

test('reloading a public category keeps the audience recovery guard', async ({
  page,
}) => {
  const game = makeGame(
    makeState({
      phase: 'day',
      players: ['villager', 'chef', 'monk', 'poisoner', 'imp'].map(
        (roleId, index) =>
          makePlayer({ roleId, name: `SECRET_RELOAD_${index}` }),
      ),
    }),
  )
  game.scriptId = 'custom'
  await page.addInitScript((game) => {
    localStorage.setItem('grimoire_language', 'en')
    localStorage.setItem('grimoire_games', JSON.stringify([game]))
  }, game)
  await page.goto(`./game/${game.id}`)
  await page
    .getByRole('button', { name: 'Player Reference', exact: true })
    .click()
  await chooseCategory(page, 'townsfolk')
  await expect(role(page, 'villager')).toHaveCount(1)
  await page.reload()
  await expect(
    page.getByRole('button', {
      name: 'Hold to return to Storyteller',
      exact: true,
    }),
  ).toBeVisible()
  await expect(page.locator('body')).not.toContainText('SECRET_RELOAD')
  await expect(page.locator('[data-category]')).toHaveCount(0)
})
