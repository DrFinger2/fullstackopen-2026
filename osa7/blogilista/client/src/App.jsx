import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { GlobalStyle } from './styles/Global.styles'

import useNotification from './hooks/useNotification'

import Loader from './components/Loader'
import Navbar from './components/Navbar'

import BlogDetailsPage from './pages/BlogDetailsPage'
import BlogsPage from './pages/BlogsPage'
import LoginPage from './pages/LoginPage'
import NewBlogPage from './pages/NewBlogPage'
import NotFoundPage from './pages/NotFoundPage'

import blogService from './services/blogs'
import registerService from './services/register'

import ErrorBoundary from './components/ErrorBoundary'
import { useBlogActions } from './hooks/useBlogs'

export default function App() {
  const [busy, setBusy] = useState(false)
  const { notification, notify } = useNotification()
  const actions = useBlogActions()
  const navigate = useNavigate()

  const fetchAll = async () => {
    setBusy(true)
    try {
      const data = await blogService.getAll()
      actions.set(data)
    } catch (err) {
      notify.error(err.response?.data?.error)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

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

  const handleReset = async () => {
    navigate('/')
    fetchAll()
    console.log('Handle reset ran!')
  }

  return (
    <>
      <GlobalStyle />
      <Navbar notification={notification} />

      <ErrorBoundary onReset={handleReset}>
        <Loader isLoading={busy} />
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<BlogsPage />} />
          <Route
            path="/login"
            element={<LoginPage onRegister={handleRegister} />}
          />
          <Route path="/blogs/new" element={<NewBlogPage notify={notify} />} />
          <Route
            path="/blogs/:id"
            element={<BlogDetailsPage notify={notify} />}
          />
        </Routes>
      </ErrorBoundary>
    </>
  )
}
