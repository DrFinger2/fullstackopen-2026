import { useState, useEffect } from 'react'
import { useNotification } from '../stores/anecdoteStore'

const Notification = () => {
  const notification = useNotification()
  const [isVisible, setIsVisible] = useState(false)
  const [isRendered, setIsRendered] = useState(false)

  useEffect(() => {
    if (notification.content && notification.id > 0) {
      const renderTimer = setTimeout(() => setIsRendered(true), 0)
      const showTimer = setTimeout(() => setIsVisible(true), 10)
      const hideTimer = setTimeout(() => setIsVisible(false), 5000)

      return () => {
        clearTimeout(renderTimer)
        clearTimeout(showTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [notification.id, notification.content])

  const handleTransitionEnd = () => {
    if (!isVisible) setIsRendered(false)
  }

  if (!isRendered) {
    return null
  }
    

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 1s ease-in-out',
  }

  return (
    <div style={style} onTransitionEnd={handleTransitionEnd}>
      {notification.content}
    </div>
  )
}

export default Notification