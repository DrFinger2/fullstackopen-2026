import { useState, useEffect } from 'react'

const Notification = ({ error, success, displayTime = 5 }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (error || success) {
      setVisible(true)
      
      const timer = setTimeout(() => {
        setVisible(false)
      }, displayTime * 1000)

      return () => clearTimeout(timer)
    }
  }, [error, success, displayTime])

  const message = error || success
  const typeClass = error ? 'error' : 'success-msg'
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