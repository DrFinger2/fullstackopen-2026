import { useState, useEffect } from 'react'
import { Container, Message } from '../styles/Notification.styles'
import { useNotification } from '../hooks/useNotification'
function Notification({ displayTime = 5 }) {
  const { message, type, id } = useNotification()
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
      <Message $type={type} $visible={isVisible && Boolean(message)}>
        {message}
      </Message>
    </Container>
  )
}

export default Notification
