import { useNavigate, useParams } from 'react-router-dom'
import BlogDetails from '../components/BlogDetails'
import blogService from '../services/blogs'
import { Container } from '../styles/Page.styles'

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
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        notify.error('Session expired, please log in again')
      } else {
        notify.error(error.response?.data?.error)
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
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        notify.error('Session expired, please log in again')
      } else {
        notify.error(error.response?.data?.error)
      }
    }
  }

  return (
    <Container>
      <BlogDetails blog={current} user={user} onLike={onLike} onRemove={onRemove} />
    </Container>
  )
}

export default BlogDetailsPage