import { useState, useEffect } from 'react'
import { Container, Message } from '../styles/Notification.styles'

function Notification({ message, type, id, displayTime = 5 }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      const timer = setTimeout(() => setIsVisible(false), displayTime * 1000)
      return () => clearTimeout(timer)
    }
  }, [id, message, displayTime])

  return (
    <Container>
      <Message $type={type} $visible={isVisible && !!message}>
        {message}
      </Message>
    </Container>
  )
}

export default Notification