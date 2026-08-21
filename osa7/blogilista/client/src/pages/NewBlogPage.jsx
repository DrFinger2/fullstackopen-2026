import { Navigate, useNavigate } from 'react-router-dom'
import { Section } from '../styles/Page.styles'
import BlogForm from '../components/BlogForm'
import blogService from '../services/blogs'
import { useBlogActions } from '../hooks/useBlogs'

function NewBlogPage({ user, logout, notify }) {
  const navigate = useNavigate()
  const actions = useBlogActions()

  if (!user) {
    return <Navigate replace to="/login" />
  }

  const handleCreate = async (newBlog) => {
    try {
      const created = await blogService.create(newBlog)
      actions.add(created)
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
    <Section>
      <BlogForm onCreateBlog={handleCreate} />
    </Section>
  )
}

export default NewBlogPage
