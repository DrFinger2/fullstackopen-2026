import { useState } from 'react'

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
            setSuccessMsg('Registration successful! Please log in.')
            e.target.reset()
        } else {
            setError(result.error)
        }
    }
    
    return (
        <div className="login-form-container" style={{ maxWidth: '300px', margin: '0 auto', padding: '20px', backgroundColor: 'white', borderRadius: '15px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <button
                    onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
                    disabled={loading}
                    style={{ fontWeight: isLogin ? 'bold' : 'normal' }}
                >
                    Login
                </button>
                <button
                    onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
                    disabled={loading}
                    style={{ fontWeight: !isLogin ? 'bold' : 'normal' }}
                >
                    Register
                </button>
            </div>

            {isLogin ? (
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h2>Login</h2>
                    <input name="username" placeholder="Username" required />
                    <input name="password" type="password" placeholder="Password" required />
                    <button disabled={loading}>
                        {showLoading ? <>Logging<span className="dots"></span></> : 'Login'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h2>Register</h2>
                    <input name="name" placeholder="Name" required />
                    <input name="username" placeholder="Username" required />
                    <input name="password" type="password" placeholder="Password" required />
                    <button disabled={loading}>
                        {showLoading ? <>Registering<span className="dots"></span></> : 'Register'}
                    </button>
                </form>
            )}

            <p className={`error ${error ? 'show' : ''}`}>
                {error}
            </p>
            {successMsg && <p style={{ color: 'green', fontSize: '14px' }}>{successMsg}</p>}
        </div>
    )
}

export default LoginForm