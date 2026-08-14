import { useState, useEffect } from 'react'

const Notification = ({ message, type, id, displayTime = 5 }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), displayTime * 1000)
      return () => clearTimeout(timer)
    }
  }, [id])

  const typeClass = type === 'error' ? 'error' : 'success-msg'
  const className = `${typeClass} ${visible && message ? 'show' : ''}`.trim()

  return (
    <div className="notification-container">
      <p className={className}>
        {message}
      </p>
    </div>
  )
}

export default Notification