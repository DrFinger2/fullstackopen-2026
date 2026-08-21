import { useState } from 'react'
import { Container, Title, Section } from '../styles/Page.styles'
import { Input, Form } from '../styles/Form.styles'

import SubmitButton from './SubmitButton'
import { useField } from '../hooks/useField'

function BlogForm({ onCreateBlog }) {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const [loading, setLoading] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  const startLoading = () => {
    setLoading(true)
    return setTimeout(() => setShowLoader(true), 300)
  }

  const stopLoading = (timer) => {
    clearTimeout(timer)
    setLoading(false)
    setShowLoader(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const timer = startLoading()
    const result = await onCreateBlog({
      title: title.field.value,
      author: author.field.value,
      url: url.field.value,
    })
    stopLoading(timer)

    if (result) {
      title.reset()
      author.reset()
      url.reset()
    }
  }

  return (
    <Container>
      <Title> Create a new blog </Title>
      <Form onSubmit={handleSubmit}>
        <Input name="title" placeholder="Title" {...title.field} />
        <Input name="author" placeholder="Author" {...author.field} />
        <Input name="url" placeholder="URL" {...url.field} />
        <SubmitButton
          text="Create"
          loadingText="Creating"
          showLoading={showLoader}
          isLoading={loading}
        />
      </Form>
    </Container>
  )
}

export default BlogForm
