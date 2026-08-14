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


const App = () => {
  const [blogs, setBlogs] = useState([])
  const { user, login, logout } = useAuth()

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
      return { ok: true, data: result }
    }
    catch (error) {
      const message = error.response?.data?.error || 'Unknown error'
      return { ok: false, error: message }
    }
  }

  const handleRegister = async (details) => {
    try {
      const result = await registerService.register(details)
      return { ok: true, data: result }
    }
    catch (error) {
      const message = error.response?.data?.error || 'Unknown error'
      return { ok: false, error: message }
    }
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      const newBlogs = blogs.concat(createdBlog)
      setBlogs(newBlogs)
      return { ok: true, data: createdBlog }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create blog'
      return { ok: false, error: message }
    }
  }

  return (
    <>
      <Navbar user={user} onLogout={logout}/>
      
      {!user ? (
        <section className="login-section">
            <LoginForm  onLogin={handleLogin}  onRegister={handleRegister}  />
        </section>
      ) : (
        <section className="blog-section">
          <Title text="Blogs" />
          <BlogForm onCreateBlog={handleCreateBlog} />
          <div className="blog-container">
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
        </section>
      )}
    </>
  )
}

export default App