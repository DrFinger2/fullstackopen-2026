import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { GlobalStyle } from './styles/Global.styles'

import Loader from './components/Loader'
import Navbar from './components/Navbar'

import BlogDetailsPage from './pages/BlogDetailsPage'
import BlogsPage from './pages/BlogsPage'
import LoginPage from './pages/LoginPage'
import NewBlogPage from './pages/NewBlogPage'
import NotFoundPage from './pages/NotFoundPage'
import blogService from './services/blogs'
import ErrorBoundary from './components/ErrorBoundary'
import { useBlogActions } from './hooks/useBlogs'
import { useUserActions } from './hooks/useUser'
import { useNotificationActions } from './hooks/useNotification'

export default function App() {
  const [busy, setBusy] = useState(false)
  const userActions = useUserActions()
  const blogActions = useBlogActions()
  const notify = useNotificationActions()
  const navigate = useNavigate()

  const fetchAll = async () => {
    setBusy(true)
    try {
      const data = await blogService.getAll()
      blogActions.set(data)
    } catch (err) {
      notify.error(err.response?.data?.error)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    userActions.init()
    fetchAll()
  }, [])

  const handleReset = async () => {
    navigate('/')
    fetchAll()
  }

  return (
    <>
      <GlobalStyle />
      <Navbar />
      <ErrorBoundary onReset={handleReset}>
        <Loader isLoading={busy} />
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<BlogsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/blogs/new" element={<NewBlogPage />} />
          <Route path="/blogs/:id" element={<BlogDetailsPage />} />
        </Routes>
      </ErrorBoundary>
    </>
  )
}
