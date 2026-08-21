import { H2, Container } from '../styles/Page.styles'
import { Button } from '../styles/Button.styles'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <Container>
      <H2>404 Page not found</H2>
      <Button onClick={() => navigate('/')}>Back to home</Button>
    </Container>
  )
}

export default NotFoundPage