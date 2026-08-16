import { render, screen } from '@testing-library/react'
import { test, expect, describe } from 'vitest'
import userEvent from '@testing-library/user-event'

import Blog from '../src/components/Blog'

const blog = {
  title: 'Test blog',
  author: 'Test author',
  url: 'https://example.com',
  likes: 1,
  user: { username: 'admin' }
}

describe('Blog', () => {
  test('1. renders title by default', async () => {
    render(
      <Blog blog={blog} user="admin" onLikeClicked={() => {}} onBlogRemoved={() => {}}/>
    )
    const element = screen.getByText('Test blog')
    expect(element).toBeDefined()
  })

  test('2. clicking "View details" shows url, likes and user', async () => {
    render(
      <Blog blog={blog} user="admin" onLikeClicked={() => {}} onBlogRemoved={() => {}}/>
    )

    const user = userEvent.setup()

    const button = screen.getByText('View details')
    await user.click(button)

    const URL = screen.getByText('https://example.com')
    expect(URL).toBeDefined()

    const author = screen.getByText('Test author')
    expect(author).toBeDefined()

    const likes = screen.getByText('1')
    expect(likes).toBeDefined()

    const remove = screen.getByText('Remove')
    expect(remove).toBeDefined()
  })

  test('3. clicking like button twice calls handler twice', async () => {
    const mockHandler = vi.fn()

    render(
      <Blog blog={blog} user="admin" onLikeClicked={mockHandler} onBlogRemoved={() => {}}/>
    )

    const user = userEvent.setup()

    const details = screen.getByText('View details')
    await user.click(details)

    const like = screen.getByText('Like')
    await user.click(like)
    await user.click(like)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
