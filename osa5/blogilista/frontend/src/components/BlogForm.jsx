import { useState } from 'react'
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
    <div className="blog-form-container">
      <form onSubmit={handleSubmit}>
        <h2>Add new blog</h2>
        <input name="title" placeholder="Title" value={title} onChange={({ target }) => setTitle(target.value)}/>
        <input name="author" placeholder="Author" value={author} onChange={({ target }) => setAuthor(target.value)}/>
        <input name="url" placeholder="URL" value={url} onChange={({ target }) => setUrl(target.value)}/>
        <SubmitButton text="Create" loadingText="Creating" showLoading={showLoader} isLoading={loading}/>
      </form>
    </div>
  )
}

export default BlogForm