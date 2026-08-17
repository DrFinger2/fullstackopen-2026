import { render, screen } from '@testing-library/react'
import { test, expect, describe, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import BlogDetails from '../src/components/BlogDetails'

const blog = {
  id: '123',
  title: 'Test blog',
  author: 'Test author',
  url: 'https://example.com',
  likes: 1,
  user: { username: 'admin', name: 'Admin User' }
}

describe('BlogDetails', () => {
  test('shows url, likes, author and user name', () => {
    render(<BlogDetails blog={blog} user="admin" onLike={() => {}} onRemove={() => {}} />)

    const urlLink = screen.getByRole('link', { name: 'https://example.com' })
    expect(urlLink).toHaveAttribute('href', 'https://example.com')
    expect(screen.getByText('Test author')).toBeDefined()
    expect(screen.getByText('1')).toBeDefined()
    expect(screen.getByText('Admin User')).toBeDefined()
  })

  test('clicking like button twice calls handler twice', async () => {
    const mockHandler = vi.fn()
    const user = userEvent.setup()

    render(<BlogDetails blog={blog} user="admin" onLike={mockHandler} onRemove={() => {}} />)
    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})