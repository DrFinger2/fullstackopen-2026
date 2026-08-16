import LoginForm from '../components/LoginForm'

const LoginPage = ({ onLogin, onRegister, notify }) => {
  return (
    <section className='login-section'>
      <LoginForm
        onLogin={onLogin}
        onRegister={onRegister}
        notify={notify}
      />
    </section>
  )
}

export default LoginPage