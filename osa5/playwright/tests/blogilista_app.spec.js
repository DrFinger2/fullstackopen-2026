const { describe, test, expect, beforeEach, beforeAll } = require('@playwright/test')

// Test data
const defaultUser = {
  name: 'Matti Luukkainen',
  username: 'mluukkai',
  password: 'salainen'
}

const otherUser = {
  name: 'Other User',
  username: 'otheruser',
  password: 'otherpassword'
}

const defaultBlog = {
  title: 'hello',
  author: 'world',
  url: 'http://www.gooogle.com'
}

// Test utilities
const loginWith = async (page, username, password) => {
  const form = page.locator('form')
  await form.getByPlaceholder('Username').fill(username)
  await form.getByPlaceholder('Password').fill(password)
  await form.getByRole('button', { name: 'login' }).click()
}

const createNewBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'Add new Blog' }).click()
  await page.getByTestId('title').fill(blog.title)
  await page.getByTestId('author').fill(blog.author)
  await page.getByTestId('url').fill(blog.url)
  await page.getByRole('button', { name: 'Create' }).click()
}

// Test setup
test.setTimeout(10 * 1000)

// Tests
describe('Blogilista', () => {
  beforeEach(async ({ page, request}) => {
    await page.request.post('/api/testing/reset')
    await request.post('/api/users', { data: defaultUser})
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const form = page.locator('form')
    await expect(form).toBeVisible()

    const username = await form.getByPlaceholder('Username')
    await expect(username).toBeVisible()
     
    const password = await form.getByPlaceholder('Password')
    await expect(password).toBeVisible()

    const loginButton = form.getByRole('button', { name: 'login' })
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('Logging in with valid credentials', async ({ page, request }) => {
      const locator = await page.getByRole('heading', { name: 'Login' })
      const valid = `Welcome back, ${defaultUser.username}!`

      await expect(locator).toBeVisible()
      await loginWith(page, defaultUser.username, defaultUser.password)
      await page.getByText(valid)
    })

    test('Logging in with invalid credentials', async ({ page, request }) => {
      const locator = await page.getByRole('heading', { name: 'Login' })
      const invalid = 'Invalid username or password'

      await expect(locator).toBeVisible()
      await loginWith(page, defaultUser.username, '123')
      await page.getByText(invalid)
    })
  })

  describe('When logged in', () => {
      beforeEach(async ({ page, request }) => {
        await loginWith(page, defaultUser.username, defaultUser.password)
      })
      test('Can create new blog', async ({ page }) => {
        await createNewBlog(page, defaultBlog)
        const blogCard = page.locator('.blog-card').filter({ hasText: defaultBlog.title })
        await expect(blogCard).toBeVisible()

        await blogCard.getByRole('button', { name: 'View details' }).click()
        await expect(blogCard.getByText(`URL: ${defaultBlog.url}`)).toBeVisible()
        await expect(blogCard.getByText(`Author: ${defaultBlog.author}`)).toBeVisible()
        await expect(blogCard.getByText('Likes: 0')).toBeVisible()
      })
    
      test('Can like created blog', async ({ page }) => {
        await createNewBlog(page, defaultBlog)
        const blogCard = page.locator('.blog-card').filter({ hasText: defaultBlog.title })
        await expect(blogCard).toBeVisible()
        
        await blogCard.getByRole('button', { name: 'View details' }).click()
        const like = await blogCard.getByRole('button', {name: 'Like'})
        await like.click()
      })
    
    test('Can remove created blog', async ({ page }) => {
        await createNewBlog(page, defaultBlog)
        const blogCard = page.locator('.blog-card').filter({ hasText: defaultBlog.title })
        await expect(blogCard).toBeVisible()
        
        await blogCard.getByRole('button', { name: 'View details' }).click()
        const remove = await blogCard.getByRole('button', { name: 'Remove' })
        page.on('dialog', dialog => dialog.accept())
      
        await remove.click()
        await expect(blogCard).not.toBeVisible()
      })
    })
})


