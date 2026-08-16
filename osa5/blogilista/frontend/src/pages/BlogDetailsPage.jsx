import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import blogService from '../services/blogs'

const BlogDetailsPage = ({ user, logout, notify, blogState }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const blog = blogState?.blogs.find((b) => b.id === id)

  if (!blog) {
    return (
      <div className='blog-details-container'>
        <p>Blog not found or still loading...</p>
      </div>
    )
  }

  const isCreator = Boolean(user) && blog.user?.username === user

  const handleLike = async () => {
    try {
      const updatedBlog = await blogService.like(blog)
      blogState.update(updatedBlog) // Keep global state in sync
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        notify.error('Session expired, please log in again')
      } else {
        notify.error(error.response?.data?.error || 'Failed to like blog')
      }
    }
  }

  const handleRemove = async () => {
    if (!window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      return
    }
    try {
      await blogService.remove(blog.id)
      blogState.remove(blog.id)
      notify.success('Blog removed successfully!')
      navigate('/')
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        notify.error('Session expired, please log in again')
      } else {
        notify.error(error.response?.data?.error || 'Failed to remove blog')
      }
    }
  }

  return (
    <div className='blog-details-page'>
      <Header text={blog.title} />
      <p><strong>URL: </strong><a href={blog.url} target='_blank' rel='noreferrer'>{blog.url}</a></p>
      <p><strong>Author: </strong>{blog.author}</p>
      <p>
        <strong>Likes: </strong>{blog.likes}
        {user && <button onClick={handleLike}>Like</button>}
      </p>
      <p><strong>Added by: </strong>{blog.user?.name || blog.user?.username || 'Unknown'}</p>

      {isCreator && (
        <button onClick={handleRemove}>Remove</button>
      )}
    </div>
  )
}

export default BlogDetailsPage