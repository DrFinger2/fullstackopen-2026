import { render, screen } from '@testing-library/react'
import { test, expect, describe } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Blog from '../src/components/Blog'

const blog = {
  id: '123',
  title: 'Test blog',
  author: 'Test author',
  url: 'https://example.com',
  likes: 1,
  user: { username: 'admin' }
}

describe('Blog', () => {
  test('1. renders title by default', () => {
    render(
      <BrowserRouter>
        <Blog blog={blog} />
      </BrowserRouter>
    )

    const titleLink = screen.getByRole('link', { name: 'Test blog' })
    expect(titleLink).toBeDefined()
    expect(titleLink).toHaveAttribute('href', '/blogs/123')
  })
})