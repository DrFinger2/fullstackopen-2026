import { Navigate, useNavigate } from 'react-router-dom'
import { Section } from '../styles/Page.styles'
import BlogForm from '../components/BlogForm'
import { useBlogActions } from '../hooks/useBlogs'
import { useUser } from '../hooks/useUser'

function NewBlogPage() {
  const user = useUser()
  const navigate = useNavigate()
  const actions = useBlogActions()

  if (!user) {
    return <Navigate replace to="/login" />
  }

  const handleCreate = async (newBlog) => {
    const created = await actions.create(newBlog)
    if (created) {
      navigate('/')
      return true
    }
    return false
  }

  return (
    <Section>
      <BlogForm onCreateBlog={handleCreate} />
    </Section>
  )
}

export default NewBlogPage
