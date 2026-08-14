import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Title from './components/Title'
import Navbar from './components/Navbar'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import registerService from './services/register'
import useAuth from './hooks/useAuth'
import useNotification from './hooks/useNotification'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const { user, login, logout } = useAuth()
  const { notification, notify } = useNotification()

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    if (user) {
      fetchBlogs()
    } else {
      setBlogs([])
    }
  }, [user])


  const handleLogin = async (credentials) => {
    try {
      const result = await loginService.login(credentials)
      login(result)
      notify.success(`Welcome back, ${result.username}!`)
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Unknown error'
      notify.error(message, 'error')
      return false;
    }
  }

  const handleRegister = async (details) => {
    try {
      await registerService.register(details)
      notify.success('Registration successful! Please log in.')
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Unknown error'
      notify.error(message)
      return false;
    }
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      notify.success(`Added "${createdBlog.title}" successfully!`)
      return true;
    }
    catch (error) {
      if (error.response?.status === 401) {
        logout()
        notify.error('Session expired, please log in again')
      } else {
        const message = error.response?.data?.error || 'Failed to create blog'
        notify.error(message)
      }
      return false;
    }
}

  return (
    <>
      <Navbar user={user} onLogout={logout} notification={notification} />
      
      {!user ? (
        <section className="login-section">
            <LoginForm onLogin={handleLogin} onRegister={handleRegister} notify={notify} />
        </section>
      ) : (
          <div className="blog-page">
          <section className="blog-section">
            <Title text="Blogs" />
            <div className="blog-container">
              {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
            </div>
          </section>
          <section className="blog-form-section">
              <BlogForm onCreateBlog={handleCreateBlog} notify={notify} />
          </section>
        </div>
      )}
    </>
  )
}

export default App