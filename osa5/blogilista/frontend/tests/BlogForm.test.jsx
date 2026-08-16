import { render, screen } from '@testing-library/react'
import { test, expect, describe } from 'vitest'
import userEvent from '@testing-library/user-event'

import BlogForm from '../src/components/BlogForm'


describe('BlogForm', () => {
  test('1. Creating a blog calls onCreateBlog with correct data', async () => {
    const handleBlogCreated = vi.fn()

    render(<BlogForm onCreateBlog={handleBlogCreated} />)
    const user = userEvent.setup()

    const title = screen.getByPlaceholderText('Title')
    await user.type(title, 'Example title')

    const author = screen.getByPlaceholderText('Author')
    await user.type(author, 'Example author')

    const url = screen.getByPlaceholderText('URL')
    await user.type(url, 'www.example.com')

    const create = screen.getByText('Create')
    await user.click(create)

    expect(handleBlogCreated).toHaveBeenCalledWith({
      title: 'Example title',
      author: 'Example author',
      url: 'www.example.com'
    })
  })
})