import { useState } from 'react'
import Notification from './Notification'

const BlogForm = ({ onCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    const result = await onCreateBlog({ title, author, url })
    setLoading(false)

    if (result.ok) {
      setTitle('')
      setAuthor('')
      setUrl('')
      setSuccessMsg(`Added "${title}" successfully!`)
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="blog-form-container">
      <form onSubmit={handleSubmit}>
        <h2>Create new blog</h2>
        <input name="title" placeholder="Title" value={title} onChange={({ target }) => setTitle(target.value)} />
        <input name="author" placeholder="Author" value={author} onChange={({ target }) => setAuthor(target.value)} />
        <input name="url" placeholder="URL" value={url} onChange={({ target }) => setUrl(target.value)}/>
        <button disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>

      <Notification error={error} success={successMsg} />
    </div>
  )
}

export default BlogForm