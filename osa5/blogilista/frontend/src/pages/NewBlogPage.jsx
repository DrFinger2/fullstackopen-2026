import { Navigate, useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import BlogForm from '../components/BlogForm'
import blogService from '../services/blogs'

function NewBlogPage({ user, logout, notify, blogState }) {
  const navigate = useNavigate()

  if (!user) {
    return <Navigate replace to="/login" />
  }

  const handleCreate = async (newBlog) => {
    try {
      const created = await blogService.create(newBlog)
      blogState.add(created)
      notify.success(`Added '${created.title}' successfully!`)
      navigate('/')
      return true
    } catch (err) {
      if (err.response?.status === 401) {
        logout()
        notify.error('Session expired, please log in again')
      } else {
        notify.error(err.response?.data?.error)
      }
      return false
    }
  }

  return (
    <section className="blog-form-section">
      <Title text="Create a new blog" />
      <BlogForm onCreateBlog={handleCreate} />
    </section>
  )
}

export default NewBlogPage