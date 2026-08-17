import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import BlogDetails from '../components/BlogDetails'
import blogService from '../services/blogs'


function BlogDetailsPage({ user, logout, notify, blogState }) {
  const navigate = useNavigate()
  const { id } = useParams()

  const current = (blogState?.blogs.find((b) => b.id === id))
  if (!current) {
    return (
      <div className="blog-details-container">
        <p>Blog not found</p>
      </div>
    )
  }

  const onLike = async () => {
    try {
      const updated = await blogService.like(current)
      blogState.update(updated)
    } catch (err) {
      if (err.response?.status === 401) {
        logout()
        notify.error('Session expired, please log in again')
      } else {
        notify.error(err.response?.data?.error)
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
        notify.error(err.response?.data?.error)
      }
    }
  }

  return (
    <BlogDetails blog={current} user={user} onLike={onLike} onRemove={onRemove}/>
  )
}

export default BlogDetailsPage