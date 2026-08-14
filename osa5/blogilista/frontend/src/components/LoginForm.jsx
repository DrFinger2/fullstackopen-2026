import { useState } from 'react'

const LoginForm = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true)
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
    const timer = startLoading()
    const form = new FormData(e.target)
    
    await onLogin({
      username: form.get('username'),
      password: form.get('password')
    })
    stopLoading(timer)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const timer = startLoading()
    const form = new FormData(e.target)
    
    const success = await onRegister({
      name: form.get('name'),
      username: form.get('username'),
      password: form.get('password')
    })

    stopLoading(timer)
    
    if (success) {
      setIsLogin(true) 
      e.target.reset()
    }
  }

  return (
    <div className="login-form-container">
      <div className="form-toggle">
        <button type="button" onClick={() => setIsLogin(true)} disabled={loading} className={isLogin ? 'active' : ''}>
          Login
        </button>
        <button type="button" onClick={() => setIsLogin(false)} disabled={loading} className={!isLogin ? 'active' : ''}>
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
    </div>
  )
}

export default LoginForm