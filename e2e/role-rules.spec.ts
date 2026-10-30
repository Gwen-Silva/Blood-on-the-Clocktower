import { test, expect } from '@playwright/test'

test('short reference screens allow native scroll gestures to reach the rules control', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('./roles/imp')
  await page.addStyleTag({
    content: '.animate-card-float { animation: none !important }',
  })
  await page.getByRole('button', { name: 'Ver regras', exact: true }).waitFor()
  const region = page.locator('.game-content')
  await page.mouse.move(150, 450)
  await page.mouse.wheel(0, 350)
  await expect
    .poll(() => region.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0)
  const trigger = page.getByRole('button', { name: 'Ver regras', exact: true })
  const box = (await trigger.boundingBox())!
  expect(box.y + box.height).toBeLessThanOrEqual(568)
  await trigger.tap()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('rules stay static, scroll independently and close before a private reveal can advance', async ({
  page,
  context,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('grimoire_language', 'en'),
  )
  await page.goto('./')
  await page.getByRole('button', { name: /^Tap to open$/i }).click()
  await page.getByRole('button', { name: /^New Game/i }).click()
  for (let i = 0; i < 5; i++)
    await page
      .getByRole('textbox')
      .nth(i)
      .fill(`Private Seat ${i + 1}`)
  await page.getByRole('button', { name: /Select Characters/i }).click()
  await page.getByRole('button', { name: /^Trouble Brewing/i }).click()
  await page.getByRole('button', { name: /^Manual$/i }).click()
  for (const role of ['Librarian', 'Mayor', 'Soldier', 'Spy'])
    await page
      .getByRole('button', { name: new RegExp('^' + role + ' ') })
      .click()
  await page.getByRole('button', { name: /Assign Characters/i }).click()
  await page.getByRole('button', { name: /^Review Setup$/i }).click()
  await page.getByRole('button', { name: /^Create Game$/i }).click()
  await page.getByRole('button', { name: /Private Seat 1/ }).click()
  await page
    .getByRole('button', {
      name: /Ready to Look|Tap when they are ready to look/i,
    })
    .click()
  await page.addStyleTag({
    content: '.animate-card-float { animation: none !important }',
  })
  const saved = await page.evaluate(() => JSON.stringify(localStorage))
  const character = await page.locator('h1.role-card-name').textContent()
  const trigger = page.getByRole('button', { name: 'View rules', exact: true })
  await trigger.tap()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).not.toContainText('Private Seat')
  await expect(dialog).not.toContainText('Choose New Imp')
  const link = dialog.getByRole('link')
  await link.scrollIntoViewIfNeeded()
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  let wikiReferrer: string | undefined
  await context.route(
    'https://wiki.bloodontheclocktower.com/**',
    async (route) => {
      wikiReferrer = route.request().headers().referer
      expect(route.request().url()).not.toContain('Private')
      await route.fulfill({
        contentType: 'text/html',
        body: '<title>Static wiki destination</title>',
      })
    },
  )
  const popupPromise = context.waitForEvent('page')
  await link.tap()
  const popup = await popupPromise
  await popup.waitForLoadState('domcontentloaded')
  expect(wikiReferrer).toBeUndefined()
  await popup.close()
  await expect(dialog).toBeVisible()
  await page.goBack()
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(page.locator('h1.role-card-name')).toHaveText(character!)
  await expect(page.getByText('Private Seat 2', { exact: true })).toHaveCount(0)
  await trigger.press('Enter')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Close', exact: true }).tap()
  await expect(dialog).toHaveCount(0)
  expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(saved)
  await page.getByRole('button', { name: /I Understand My Role/i }).click()
  const handback = page.getByRole('button', {
    name: /Hold to return to Storyteller/i,
  })
  await expect(handback).toBeVisible()
  await handback.click()
  await expect(handback).toBeVisible()
  await expect(page.locator('h1.role-card-name')).toHaveCount(0)
  const box = (await handback.boundingBox())!
  const session = await context.newCDPSession(page)
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }],
  })
  await page.waitForTimeout(500)
  await handback.dispatchEvent('contextmenu')
  await expect(handback).toBeVisible()
  await page.waitForTimeout(600)
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  })
  await expect(handback).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Ready to Look', exact: true }),
  ).toBeVisible()
})

test('narrow cards and rules remain readable with enlarged text and keyboard dismissal', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('grimoire_language', 'pt-BR'),
  )
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('./roles/librarian')
  await page.addStyleTag({
    content:
      ':root { font-size: 200% } .animate-card-float { animation: none !important }',
  })
  await page.evaluate(() => document.fonts.ready)
  const name = page.locator('h1.role-card-name')
  await expect(name).toHaveText('Bibliotecário')
  await expect
    .poll(() => name.evaluate((el) => el.scrollWidth <= el.clientWidth + 1))
    .toBe(true)
  const trigger = page.getByRole('button', { name: 'Ver regras', exact: true })
  await trigger.press('Enter')
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect
    .poll(() =>
      dialog
        .locator('h2.role-card-name')
        .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    )
    .toBe(true)
  await dialog.getByRole('link').scrollIntoViewIfNeeded()
  await expect(dialog.getByRole('link')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
})
