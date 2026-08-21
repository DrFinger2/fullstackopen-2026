import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router-dom'
import { Section } from '../styles/Page.styles'
import { useUserActions } from '../hooks/useUser'

function LoginPage({ onRegister, user }) {
  const actions = useUserActions()
  const navigate = useNavigate()

  const isLoggedIn = Boolean(user)
  if (isLoggedIn) {
    navigate('/')
  }

  return (
    <Section>
      <LoginForm onLogin={actions.login} onRegister={onRegister} />
    </Section>
  )
}

export default LoginPage
