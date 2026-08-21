import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router-dom'
import { Section } from '../styles/Page.styles'
function LoginPage({ onLogin, onRegister, user }) {
  const navigate = useNavigate()

  const isLoggedIn = Boolean(user)
  if (isLoggedIn) {
    navigate('/')
  }

  return (
    <Section>
      <LoginForm onLogin={onLogin} onRegister={onRegister} />
    </Section>
  )
}

export default LoginPage
