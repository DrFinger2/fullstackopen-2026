import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { GlobalStyle } from './styles/Global.styles'
import { useBlogActions } from './hooks/useBlogs'
import { useUserActions } from './hooks/useUser'

import Loader from './components/Loader'
import Navbar from './components/Navbar'
import BlogDetailsPage from './pages/BlogDetailsPage'
import BlogsPage from './pages/BlogsPage'
import LoginPage from './pages/LoginPage'
import NewBlogPage from './pages/NewBlogPage'
import NotFoundPage from './pages/NotFoundPage'
import ErrorBoundary from './components/ErrorBoundary'
import UsersPage from './pages/UsersPage'
import UserDetailsPage from './pages/UserDetailsPage'
export default function App() {
  const userActions = useUserActions()
  const blogActions = useBlogActions()
  const navigate = useNavigate()

  useEffect(() => {
    userActions.init()
    userActions.fetchAll()
    blogActions.fetchAll()
  }, [])

  const handleReset = async () => {
    navigate('/')
    userActions.fetchAll()
    blogActions.fetchAll()
  }

  return (
    <>
      <GlobalStyle />
      <Navbar />
      <ErrorBoundary onReset={handleReset}>
        <Loader />
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<BlogsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/blogs/new" element={<NewBlogPage />} />
          <Route path="/blogs/:id" element={<BlogDetailsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:username" element={<UserDetailsPage />} />
        </Routes>
      </ErrorBoundary>
    </>
  )
}
