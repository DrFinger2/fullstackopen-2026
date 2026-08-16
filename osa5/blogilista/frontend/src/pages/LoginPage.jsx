import LoginForm from '../components/LoginForm'

function LoginPage({ onLogin, onRegister }) {
  return (
    <section className="login-section">
      <LoginForm onLogin={onLogin} onRegister={onRegister} />
    </section>
  )
}

export default LoginPage