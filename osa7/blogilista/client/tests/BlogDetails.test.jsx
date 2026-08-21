import { render, screen } from '@testing-library/react'
import { test, expect, describe, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import BlogDetails from '../src/components/BlogDetails'
import { MemoryRouter } from 'react-router-dom'

const blog = {
  id: '123',
  title: 'Test blog',
  author: 'Test author',
  url: 'https://example.com',
  likes: 1,
  user: { username: 'admin', name: 'Admin User' },
}

describe('BlogDetails', () => {
  test('when logged in, url, likes, author and username are shown', () => {
    render(
      <MemoryRouter>
        <BlogDetails
          blog={blog}
          user="admin"
          onLike={() => {}}
          onRemove={() => {}}
        />
      </MemoryRouter>
    )

    const urlLink = screen.getByRole('link', { name: 'https://example.com' })
    expect(urlLink).toHaveAttribute('href', 'https://example.com')
    expect(screen.getByText('Test author')).toBeDefined()
    expect(screen.getByText('1')).toBeDefined()
    expect(screen.getByText('Admin User')).toBeDefined()
  })

  test('when logged in, clicking like button twice calls handler twice', async () => {
    const mockHandler = vi.fn()
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <BlogDetails
          blog={blog}
          user="admin"
          onLike={mockHandler}
          onRemove={() => {}}
        />
      </MemoryRouter>
    )
    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })

  test('when not logged in, like and remove button are not shown', async () => {
    render(
      <MemoryRouter>
        <BlogDetails
          blog={blog}
          user={null}
          onLike={() => {}}
          onRemove={() => {}}
        />
      </MemoryRouter>
    )
    expect(screen.queryByText('Like')).toBeNull()
    expect(screen.queryByText('Remove')).toBeNull()
  })

  test('when logged in as someone else than creator, only like button is shown', async () => {
    render(
      <MemoryRouter>
        <BlogDetails
          blog={blog}
          user="someone"
          onLike={() => {}}
          onRemove={() => {}}
        />
      </MemoryRouter>
    )
    expect(screen.queryByText('Like')).toBeDefined()
    expect(screen.queryByText('Remove')).toBeNull()
  })

  test('when logged in as creator, both like button and remove button are shown', async () => {
    render(
      <MemoryRouter>
        <BlogDetails
          blog={blog}
          user="admin"
          onLike={() => {}}
          onRemove={() => {}}
        />
      </MemoryRouter>
    )
    expect(screen.queryByText('Like')).toBeDefined()
    expect(screen.queryByText('Remove')).toBeDefined()
  })
})
