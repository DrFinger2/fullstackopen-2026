import { useState } from 'react'
import { Container, Title, Section } from '../styles/Page.styles'
import { Input, Form } from '../styles/Form.styles'

import SubmitButton from './SubmitButton'

function BlogForm({ onCreateBlog }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  const startLoading = () => {
    setLoading(true)
    return setTimeout(() => setShowLoader(true), 300)
  }

  const stopLoading = timer => {
    clearTimeout(timer)
    setLoading(false)
    setShowLoader(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const timer = startLoading()
    const result = await onCreateBlog({ title, author, url })
    stopLoading(timer)
    if (result) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <Container>
      <Title> Create a new blog </Title>
      <Form onSubmit={handleSubmit}>
        <Input name="title" placeholder="Title" value={title} onChange={({ target }) => setTitle(target.value)}/>
        <Input name="author" placeholder="Author" value={author} onChange={({ target }) => setAuthor(target.value)}/>
        <Input name="url" placeholder="URL" value={url} onChange={({ target }) => setUrl(target.value)}/>
        <SubmitButton text="Create" loadingText="Creating" showLoading={showLoader} isLoading={loading}/>
      </Form>
    </Container>
  )
}

export default BlogForm