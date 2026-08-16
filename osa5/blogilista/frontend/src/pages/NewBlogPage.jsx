import { Navigate, useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import BlogForm from '../components/BlogForm'
import blogService from '../services/blogs'

const NewBlogPage = ({ user, logout, notify, blogState }) => {
  const navigate = useNavigate()

  if (!user) {
    return <Navigate replace to='/login' />
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      blogState.add(createdBlog)
      notify.success(`Added '${createdBlog.title}' successfully!`)
      navigate('/')
      return true
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        notify.error('Session expired, please log in again')
      } else {
        notify.error(error.response?.data?.error || 'Failed to create blog')
      }
      return false
    }
  }

  return (
    <section className='blog-form-section'>
      <Title text='Create a new blog' />
      <BlogForm onCreateBlog={handleCreateBlog} notify={notify} />
    </section>
  )
}

export default NewBlogPage