import { useState } from 'react'
import SubmitButton from './SubmitButton'
import { Input, Form } from '../styles/Form.styles'
import { Title, Container } from '../styles/Page.styles'
import { ToggleGroup, ToggleOption } from '../styles/Button.styles'

function TextInput({ value, onChange, placeholder }) {
  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function PasswordInput({ value, onChange, placeholder = 'Password' }) {
  return (
    <Input
      type="password"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function LoginForm({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  const startLoading = () => {
    setLoading(true)
    return setTimeout(() => setShowLoader(true), 300)
  }

  const stopLoading = (timer) => {
    clearTimeout(timer)
    setLoading(false)
    setShowLoader(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const timer = startLoading()
    await onLogin({ username, password })
    stopLoading(timer)
  }

  const handleRegister = async (e) => {
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
    <Container>
      <ToggleGroup>
        <ToggleOption
          $active={isLogin}
          onClick={() => setIsLogin(true)}
          disabled={loading}
        >
          Login
        </ToggleOption>
        <ToggleOption
          $active={!isLogin}
          onClick={() => setIsLogin(false)}
          disabled={loading}
        >
          Register
        </ToggleOption>
      </ToggleGroup>

      {isLogin ? (
        <Form onSubmit={handleLogin}>
          <Title>Login</Title>
          <TextInput
            placeholder="Username"
            value={username}
            onChange={setUsername}
          />
          <PasswordInput value={password} onChange={setPassword} />
          <SubmitButton
            text="Login"
            loadingText="Logging"
            showLoading={showLoader}
            isLoading={loading}
          />
        </Form>
      ) : (
        <Form onSubmit={handleRegister}>
          <Title>Register</Title>
          <TextInput placeholder="Name" value={name} onChange={setName} />
          <TextInput
            placeholder="Username"
            value={username}
            onChange={setUsername}
          />
          <PasswordInput value={password} onChange={setPassword} />
          <SubmitButton
            text="Register"
            loadingText="Registering"
            showLoading={showLoader}
            isLoading={loading}
          />
        </Form>
      )}
    </Container>
  )
}

export default LoginForm
