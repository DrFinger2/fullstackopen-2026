import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Title from './components/Title'
import Navbar from './components/Navbar'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import registerService from './services/register'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null) // New state to track logged-in user

  const saveUser = (user) => {
    setUser(user)
    if (user) {
      window.localStorage.setItem('user', JSON.stringify(user))
    } else {
      window.localStorage.removeItem('user')
    }
  }

  const loadUser = () => {
    const userJson = window.localStorage.getItem('user');
    if (userJson)
      return JSON.parse(userJson)
    else 
      return null
  }

  useEffect(() => {
   setUser(loadUser())
  }, [])

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
      console.log(result)
      saveUser(result)
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

  const handleLogout = () => {
    saveUser(null)
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      
      {/* SPA Logic: Conditionally render based on user state */}
      {!user ? (
        <section className="login-section">
            <LoginForm  onLogin={handleLogin}  onRegister={handleRegister}  />
        </section>
      ) : (
        <section className="blog-section">
          <Title text="Blogs"/>
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