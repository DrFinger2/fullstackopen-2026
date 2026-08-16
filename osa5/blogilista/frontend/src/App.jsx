import { useState, useEffect } from 'react'
import { Routes } from 'react-router-dom'

import Navbar from './components/Navbar'
import Loader from './components/Loader'
import LoginPage from './pages/LoginPage'
import BlogsPage from './pages/BlogsPage'

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

  useEffect(() => {
    const fetchBlogs = async () => {
      if (user) {
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
    }
    fetchBlogs()
  }, [user])

  const handleLogin = async (credentials) => {
    try {
      const result = await loginService.login(credentials)
      login(result)
      notify.success(`Welcome back, ${result.username}!`)
      return true
    } catch (error) {
      notify.error(error.response?.data?.error)
      return false
    }
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
      <Navbar user={user} onLogout={logout} notification={notification} />
      <Loader isLoading={loading} />
      <Routes>
        <Route />
        <Route />
        <Route />
      </Routes>
      {!user ? (
        <LoginPage onLogin={handleLogin} onRegister={handleRegister} notify={notify}/>
      ) : (
        <BlogsPage user={user} logout={logout} notify={notify} blogState={blogState}/>
      )}
    </>
  )
}

export default App