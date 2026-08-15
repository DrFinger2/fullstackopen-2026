import { useState } from 'react'
import SubmitButton from './SubmitButton'
const TextInput = ({ value, onChange, placeholder }) => (
  <input type='text' placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}/>
)

const PasswordInput = ({ value, onChange, placeholder = 'Password' }) => (
  <input type='password' placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}/>
)


const LoginForm = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true)


  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  const startLoading = () => {
    setLoading(true)
    return setTimeout(() => setShowLoading(true), 300)
  }

  const stopLoading = timer => {
    clearTimeout(timer)
    setLoading(false)
    setShowLoading(false)
  }

  const handleLogin = async e => {
    e.preventDefault()
    const timer = startLoading()
    await onLogin({ username, password })
    stopLoading(timer)
  }

  const handleRegister = async e => {
    e.preventDefault()
    const timer = startLoading()
    const success = await onRegister({ name, username, password })
    stopLoading(timer)
    if (success) {
      setIsLogin(true)
      setName('')
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div className='login-form-container'>
      <div className='form-toggle'>
        <button onClick={() => setIsLogin(true)} disabled={loading} className={isLogin ? 'active' : ''}>
          Login
        </button>
        <button onClick={() => setIsLogin(false)} disabled={loading} className={!isLogin ? 'active' : ''} >
          Register
        </button>
      </div>

      {isLogin ? (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <TextInput placeholder='Username' value={username} onChange={setUsername}/>
          <PasswordInput value={password} onChange={setPassword} />
          <SubmitButton text='Login' loadingText='Logging' showLoading={showLoading} isLoading={loading} />
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <TextInput placeholder='Name' value={name} onChange={setName} />
          <TextInput placeholder='Username' value={username} onChange={setUsername}/>
          <PasswordInput value={password} onChange={setPassword} />
          <SubmitButton text='Register' loadingText='Registering' showLoading={showLoading} isLoading={loading} />
        </form>
      )}
    </div>
  )
}


export default LoginForm