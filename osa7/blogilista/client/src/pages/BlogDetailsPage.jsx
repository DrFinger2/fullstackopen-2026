import { useNavigate, useParams } from 'react-router-dom'
import BlogDetails from '../components/BlogDetails'
import blogService from '../services/blogs'
import { Wrapper } from '../styles/Page.styles'
import { useBlogs, useBlogActions } from '../hooks/useBlogs'

function BlogDetailsPage({ user, logout, notify }) {
  const navigate = useNavigate()
  const actions = useBlogActions()
  const blogs = useBlogs()

  const { id } = useParams()

  const current = blogs?.find((b) => b.id === id)

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
      actions.update(updated)
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
    if (
      !window.confirm(`Remove blog "${current.title}" by ${current.author}?`)
    ) {
      return
    }

    try {
      await blogService.remove(current.id)
      actions.remove(current.id)
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
    <Wrapper>
      <BlogDetails
        blog={current}
        user={user}
        onLike={onLike}
        onRemove={onRemove}
      />
    </Wrapper>
  )
}

export default BlogDetailsPage
