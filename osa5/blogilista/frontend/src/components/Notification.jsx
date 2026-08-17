import { useState, useEffect } from 'react'

function Notification({ message, type, id, displayTime = 5 }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      const timer = setTimeout(() => setIsVisible(false), displayTime * 1000)
      return () => clearTimeout(timer)
    }
  }, [id, message, displayTime])

  const typeClass = type === 'error' ? 'error' : 'success-msg'
  const className = `${typeClass} ${isVisible && message ? 'show' : ''}`

  return (
    <div className="notification-container">
      <p className={className}>{message}</p>
    </div>
  )
}

export default Notification