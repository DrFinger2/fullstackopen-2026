import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import useAuth from './hooks/useAuth'
import useBlogs from './hooks/useBlogs'
import useNotification from './hooks/useNotification'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import BlogDetailsPage from './pages/BlogDetailsPage'
import BlogsPage from './pages/BlogsPage'
import LoginPage from './pages/LoginPage'
import NewBlogPage from './pages/NewBlogPage'
import blogService from './services/blogs'
import loginService from './services/login'
import registerService from './services/register'

export default function App() {
  const [busy, setBusy] = useState(false)
  const { user, login, logout } = useAuth()
  const { notification, notify } = useNotification()
  const blogState = useBlogs()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAll = async () => {
      setBusy(true)
      try {
        const data = await blogService.getAll()
        blogState.set(data)
      } catch (err) {
        notify.error(err.response?.data?.error)
      } finally {
        setBusy(false)
      }
    }
    fetchAll()
  }, [])

  const handleLogin = async (creds) => {
    try {
      const result = await loginService.login(creds)
      login(result)
      notify.success(`Welcome back, ${result.username}!`)
      navigate('/')
      return true
    } catch (err) {
      notify.error(err.response?.data?.error)
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
    } catch (err) {
      notify.error(err.response?.data?.error)
      return false
    }
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} notification={notification} />
      <Loader isLoading={busy} />
      <Routes>
        <Route path="/" element={<BlogsPage blogState={blogState} />}  />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} onRegister={handleRegister} />}  />
        <Route path="/blogs/new" element={ <NewBlogPage user={user} logout={logout} notify={notify} blogState={blogState}/>}/>
        <Route path="/blogs/:id" element={  <BlogDetailsPage user={user} logout={logout} notify={notify} blogState={blogState}/> } />
      </Routes>
    </>
  )
}