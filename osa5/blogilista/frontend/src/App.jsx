import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Loader from './components/Loader'
import LoginPage from './pages/LoginPage'
import BlogsPage from './pages/BlogsPage'
import BlogDetailsPage from './pages/BlogDetailsPage'
import NewBlogPage from './pages/NewBlogPage'

import useAuth from './hooks/useAuth'
import useNotification from './hooks/useNotification'
import useBlogs from './hooks/useBlogs'

import loginService from './services/login'
import registerService from './services/register'
import blogService from './services/blogs'


const App = () => {
  const [loading, setLoading] = useState(false)
  const { user, login, logout } = useAuth()
  const { notification, notify } = useNotification()
  const blogState = useBlogs()
  const navigate = useNavigate()


  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const blogs = await blogService.getAll()
        blogState.set(blogs)
      } catch (error) {
        notify.error(error.response?.data?.error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const result = await loginService.login(credentials)
      login(result)
      notify.success(`Welcome back, ${result.username}!`)
      navigate('/')
      return true
    } catch (error) {
      notify.error(error.response?.data?.error)
      return false
    }
  }

  const handleLogout = () => {
    logout()
    notify.success('Logged out successfully')
    navigate('/')
  }

  const handleRegister = async (details) => {
    try {
      await registerService.register(details)
      notify.success('Registration successful! Please log in.')
      return true
    } catch (error) {
      notify.error(error.response?.data?.error)
      return false
    }
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} notification={notification} />
      <Loader isLoading={loading} />
      <Routes>
        <Route path='/' element={<BlogsPage user={user} blogState={blogState} />} />
        <Route path='/login' element={<LoginPage onLogin={handleLogin} onRegister={handleRegister} notify={notify} />} />
        <Route path='/blogs/new' element={<NewBlogPage user={user} logout={logout} notify={notify} blogState={blogState} />} />
        <Route path='/blogs/:id' element={<BlogDetailsPage user={user} logout={logout} notify={notify} blogState={blogState} />} />
      </Routes>
    </>
  )
}

export default App