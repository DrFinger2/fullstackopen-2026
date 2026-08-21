import { useEffect } from 'react'
import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router-dom'
import { Section } from '../styles/Page.styles'
import { useUser, useUserActions } from '../hooks/useUser'
import loginService from '../services/login'
import registerService from '../services/register'
import { useNotificationActions } from '../hooks/useNotification'

function LoginPage() {
  const notify = useNotificationActions()
  const user = useUser()
  const actions = useUserActions()
  const navigate = useNavigate()

  const isLoggedIn = Boolean(user)

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn, navigate])

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

  const handleLogin = async (creds) => {
    try {
      const result = await loginService.login(creds)
      actions.login(result)
      notify.success(`Welcome back, ${result.username}!`)
      navigate('/')
      return true
    } catch (err) {
      notify.error(err.response?.data?.error)
      return false
    }
  }

  return (
    <Section>
      <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
    </Section>
  )
}

export default LoginPage
