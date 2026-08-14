import { useState } from 'react'
import Notification from './Notification'

const LoginForm = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  const startLoading = () => {
    setLoading(true)
    return setTimeout(() => { setShowLoading(true) }, 300)
  }

  const stopLoading = (timer) => {
    clearTimeout(timer)
    setLoading(false)
    setShowLoading(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    const timer = startLoading()
    const form = new FormData(e.target)
    const result = await onLogin({
      username: form.get('username'),
      password: form.get('password')
    })

    stopLoading(timer)
    if (!result.ok) {
      setError(result.error)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    const timer = startLoading()
    const form = new FormData(e.target)
    const result = await onRegister({
      name: form.get('name'),
      username: form.get('username'),
      password: form.get('password')
    })

    stopLoading(timer)
    
    if (result.ok) {
      setIsLogin(true) 
      e.target.reset()
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="login-form-container">
      <div className="form-toggle">
        <button
          type="button"
          onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
          disabled={loading}
          className={isLogin ? 'active' : ''}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
          disabled={loading}
          className={!isLogin ? 'active' : ''}
        >
          Register
        </button>
      </div>

      {isLogin ? (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input name="username" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={loading}>
            {showLoading ? <>Logging<span className="dots"></span></> : 'Login'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <input name="name" placeholder="Name" />
          <input name="username" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={loading}>
            {showLoading ? <>Registering<span className="dots"></span></> : 'Register'}
          </button>
        </form>
      )}

      <Notification error={error} success={successMsg} />
    </div>
  )
}

export default LoginForm