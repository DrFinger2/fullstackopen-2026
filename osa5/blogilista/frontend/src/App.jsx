import { useState, useEffect, useRef } from 'react'

// Components
import Blog from './components/Blog'
import Title from './components/Title'
import Navbar from './components/Navbar'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Loader from './components/Loader'

// Hooks
import useAuth from './hooks/useAuth'
import useBlogs from './hooks/useBlogs'
import useNotification from './hooks/useNotification'

// Services
import blogService from './services/blogs'
import loginService from './services/login'
import registerService from './services/register'




const App = () => {
  const blogState = useBlogs()
  const [loading, setLoading] = useState(false)
  const { user, login, logout } = useAuth()
  const { notification, notify } = useNotification()
  const createBlogForm = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      const blogs = await blogService.getAll()
      blogState.set(blogs)
      setLoading(false)
    }

    if (user) {
      fetchBlogs()
    } else {
      blogState.set([])
      setLoading(false)
    }
  }, [user])

  const handleLogin = async (credentials) => {
    try {
      const result = await loginService.login(credentials)
      login(result)
      notify.success(`Welcome back, ${result.username}!`)
      return true
    } catch (error) {
      const message = error.response?.data?.error || 'Unknown error'
      notify.error(message, 'error')
      return false
    }
  }

  const handleRegister = async (details) => {
    try {
      await registerService.register(details)
      notify.success('Registration successful! Please log in.')
      return true
    } catch (error) {
      const message = error.response?.data?.error || 'Unknown error'
      notify.error(message)
      return false
    }
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      blogState.add(createdBlog)
      notify.success(`Added '${createdBlog.title}' successfully!`)
      return true
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        notify.error('Session expired, please log in again')
      } else {
        const message = error.response?.data?.error || 'Failed to create blog'
        notify.error(message)
      }
      return false
    }
  }

  const handleLikeBlog = async (blogId) => {
    try {
      const updated = await blogService.like(blogId)
      blogState.update(updated)
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        notify.error('Session expired, please log in again')
      } else {
        const message = error.response?.data?.error || 'Failed to like blog'
        notify.error(message)
      }
    }
  }

  const handleRemoveBlog = async (blogId) => {
    try {
      await blogService.remove(blogId)
      blogState.remove(blogId)
    }
    catch (error) {
      const message = error.response?.data?.error || 'Failed to remove blog'
      notify.error(message)
    }
  }

  return (
    <>
      <Navbar user={user} onLogout={logout} notification={notification} />

      {!user ? (
        <section className='login-section'>
          <LoginForm onLogin={handleLogin} onRegister={handleRegister} notify={notify}/>
        </section>
      ) : (
        <div className='blog-page'>
          <section className='blog-section'>
            <Title text='Blogs' />
            <Loader isLoading={loading} />

            <div className='blog-container'>
              {blogState.blogs.map(blog =>
                <Blog
                  key={blog.id}
                  blog={blog}
                  user={user}
                  onLikeClicked={handleLikeBlog}
                  onBlogRemoved={handleRemoveBlog}
                />)}
            </div>
          </section>

          <section className='blog-form-section'>
            <Togglable ref={createBlogForm} buttonLabel='Add new Blog'>
              <BlogForm onCreateBlog={handleCreateBlog} notify={notify}/>
            </Togglable>
          </section>
        </div>
      )}
    </>
  )
}

export default App