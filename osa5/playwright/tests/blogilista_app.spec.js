const { describe, test, expect, beforeEach } = require('@playwright/test')

const TIMEOUT_SEC = 10
test.setTimeout(TIMEOUT_SEC * 1000)

const loginWith = async (page, username, password) => {
  const form = page.locator('form')
  await form.getByPlaceholder('Username').fill(username)
  await form.getByPlaceholder('Password').fill(password)
  await form.getByRole('button', { name: 'login' }).click()
}

describe('Blogilista', () => {
  beforeEach(async ({ page }) => {
    await page.request.post('/api/testing/reset')
    await page.goto('/')
  })

  test('front page can be opened', async ({ page, request }) => {
    const locator = await page.getByRole('heading', {name: 'Login'})
    await expect(locator).toBeVisible()
    loginWith(page, 'admin', 'admin')
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      loginWith(page, 'admin', 'admin')
    })

    test('', async ({ page }) => {
      
    })
  })


})


