const { describe, test, expect, beforeEach } = require('@playwright/test')

describe('Blogilista', () => {
  beforeEach(() => {
    await request.post('http://localhost:3001/api/testing/reset')
    await page.goto('http://localhost:3001')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByRole('heading', {name: 'Login'})
    await expect(locator).toBeVisible()
    const form = page.locator('form')

    const username = await form.getByPlaceholder('Username')
    await expect(username).toBeVisible()
    const password = await form.getByPlaceholder('Username')
    await expect(password).toBeVisible()

    await username.fill('admin')
    await password.fill('admin')
    
    const button = await form.getByRole('button', { text: 'Login' })
    await expect(button).toBeVisible()
    await button.click()
  })

  describe('When logged in', () => {
    beforeEach(() => {
      const form = page.locator('form')
      await await form.getByPlaceholder('Username').fill('admin')
      await await form.getByPlaceholder('Username').fill('admin')
      await await form.getByRole('button', { text: 'Login' }).click()
    })

    test('', async ({ page }) => {
      
    })
  })


})


