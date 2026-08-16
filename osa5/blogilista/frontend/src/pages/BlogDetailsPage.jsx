import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import blogService from '../services/blogs'

function BlogDetailsPage({ user, logout, notify, blogState }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const current = blogState?.blogs.find((b) => b.id === id)

  if (!current) {
    return (
      <div className="blog-details-container">
        <p>Blog not found or still loading…</p>
      </div>
    )
  }

  const isOwner = Boolean(user) && current.user?.username === user

  const onLike = async () => {
    try {
      const updated = await blogService.like(current)
      blogState.update(updated)
    } catch (err) {
      if (err.response?.status === 401) {
        logout()
        notify.error('Session expired, please log in again')
      } else {
        notify.error(err.response?.data?.error || 'Failed to like blog')
      }
    }
  }

  const onRemove = async () => {
    if (!window.confirm(`Remove blog "${current.title}" by ${current.author}?`)) {
      return
    }
    try {
      await blogService.remove(current.id)
      blogState.remove(current.id)
      notify.success('Blog removed successfully!')
      navigate('/')
    } catch (err) {
      if (err.response?.status === 401) {
        logout()
        notify.error('Session expired, please log in again')
      } else {
        notify.error(err.response?.data?.error || 'Failed to remove blog')
      }
    }
  }

  return (
    <div className="blog-details-page">
      <Header text={current.title} />
      <p>
        <strong>URL: </strong>
        <a href={current.url} target="_blank" rel="noreferrer"> {current.url}</a>
      </p>
      <p>
        <strong>Author: </strong> {current.author}
      </p>
      <p>
        <strong>Likes: </strong> {current.likes}
        {user && <button onClick={onLike}>Like</button>}
      </p>
      <p>
        <strong>Added by: </strong>
        {current.user?.name || current.user?.username || 'Unknown'}
      </p>

      {isOwner && <button onClick={onRemove}>Remove</button>}
    </div>
  )
}

export default BlogDetailsPage