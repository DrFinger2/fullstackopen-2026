import { useState } from 'react'

import SubmitButton from './SubmitButton'
import { Input, Form } from '../styles/Form.styles'
import { Title, Container } from '../styles/Page.styles'
import { ToggleGroup, ToggleOption } from '../styles/Button.styles'
import { useField } from '../hooks/useField'

function LoginForm({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true)
  const name = useField('text')
  const username = useField('text')
  const password = useField('password')

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
    await onLogin({
      username: username.field.value,
      password: password.field.value,
    })
    stopLoading(timer)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const timer = startLoading()
    const success = await onRegister({
      name: name.field.value,
      username: username.field.value,
      password: password.field.value,
    })

    stopLoading(timer)
    if (success) {
      setIsLogin(true)
      name.reset()
      username.reset()
      password.reset()
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

      {isLogin && (
        <Form onSubmit={handleLogin}>
          <Title>Login</Title>
          <Input placeholder="Username" {...username.field} />
          <Input placeholder="Username" {...password.field} />
          <SubmitButton
            text="Login"
            loadingText="Logging"
            showLoading={showLoader}
            isLoading={loading}
          />
        </Form>
      )}

      {!isLogin && (
        <Form onSubmit={handleRegister}>
          <Title>Register</Title>
          <Input placeholder="Name" {...name.field} />
          <Input placeholder="Username" {...username.field} />
          <Input placeholder="Password" {...password.field} />
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
