import { test, expect } from '@playwright/test'

// Also runs against W03/W04 with E2E_BASE_URL. On W03, the first detail
// assertion fails before Continue: the shared Storyteller modal stays hidden.
test('touch opens multiple Spy details before Continue, then returns without a deferred dialog', async ({
  page,
  context,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem('grimoire_language', 'en'),
  )
  await page.goto('./')
  await page.getByRole('button', { name: /^Tap to open$/i }).click()
  await page.getByRole('button', { name: /^New Game/i }).click()
  const inputs = page.getByRole('textbox')
  for (let i = 0; i < 5; i++) await inputs.nth(i).fill(`Touch Seat ${i + 1}`)
  await page
    .getByRole('button', { name: /Select Characters|Next: Select Roles/i })
    .click()
  await page.getByRole('button', { name: /^Trouble Brewing/i }).click()
  await page.getByRole('button', { name: /^Manual$/i }).click()
  for (const role of ['Soldier', 'Mayor', 'Slayer', 'Spy'])
    await page
      .getByRole('button', { name: new RegExp('^' + role + ' ') })
      .click()
  await page
    .getByRole('button', { name: /Assign Characters|Next: Assign Roles/i })
    .click()
  await page.getByRole('button', { name: /^Review Setup$/i }).click()
  await page.getByRole('button', { name: /^Create Game$/i }).click()
  await page
    .getByRole('button', { name: /^Skip (?:Reveals|Role Revelation)$/i })
    .click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /Confirm Skip/i })
    .click()
  await page.getByRole('button', { name: /^1 Spy / }).click()
  await page.getByRole('button', { name: /View Grimoire/i }).click()
  await page
    .getByRole('button', {
      name: /Ready to Look|Tap when they are ready to look/i,
    })
    .click()
  const saved = await page.evaluate(() =>
    localStorage.getItem('grimoire_games'),
  )
  for (const role of ['Soldier', 'Mayor']) {
    const row = page.getByRole('button', {
      name: new RegExp(`Touch Seat \\d+ ${role}(?: |$)`),
    })
    const name = (await row.innerText()).split('\n')[0]
    await row.tap()
    // This is the specific old defect, checked before Continue or handback.
    await expect(
      page.getByRole('heading', { name, exact: true }).first(),
    ).toBeVisible({ timeout: 1500 })
    await expect(
      page.getByRole('heading', { name: role, exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /Edit Effects|Add Effect/ }),
    ).toHaveCount(0)
    await expect(
      page.locator('[title="Grimoire"],[title="History"],[role="dialog"]'),
    ).toHaveCount(0)
    if (role === 'Mayor') await page.goBack()
    else
      await page
        .getByRole('button', { name: 'Back to Grimoire', exact: true })
        .tap()
    await expect(
      page.getByRole('button', { name: /^Continue$/i }),
    ).toBeVisible()
  }
  expect(
    await page.evaluate(() => localStorage.getItem('grimoire_games')),
  ).toBe(saved)
  await page.getByRole('button', { name: /^Continue$/i }).tap()
  await expect(page.getByText(/Touch Seat/)).toHaveCount(0)
  const hold = page.getByRole('button', {
    name: /Hold to return to Storyteller/i,
  })
  const box = (await hold.boundingBox())!,
    x = box.x + box.width / 2,
    y = box.y + box.height / 2
  const cdp = await context.newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x, y }],
  })
  await page.waitForTimeout(500)
  await hold.dispatchEvent('contextmenu', { bubbles: true, cancelable: true })
  await expect(hold).toBeVisible()
  await expect(hold).toHaveCount(0)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: 2, y: 2 }],
  })
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  })
  await expect(page.locator('[role="dialog"]')).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: /Proceed to Day/i }),
  ).toBeEnabled()
  expect(
    await page.evaluate(() => localStorage.getItem('grimoire_games')),
  ).toContain('view_grimoire')
})
