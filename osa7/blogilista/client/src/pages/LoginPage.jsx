import { useEffect } from 'react'
import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router-dom'
import { Section } from '../styles/Page.styles'
import { useUser, useUserActions } from '../hooks/useUser'

function LoginPage() {
  const user = useUser()
  const actions = useUserActions()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const handleLogin = async (creds) => {
    const ok = await actions.login(creds)
    if (ok) navigate('/')
    return ok
  }

  return (
    <Section>
      <LoginForm onLogin={handleLogin} onRegister={actions.register} />
    </Section>
  )
}

export default LoginPage
