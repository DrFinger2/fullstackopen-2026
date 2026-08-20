import { UseNotification } from '../context/NotificationContext'
import { useRef } from 'react'
const useNotification = () => {
  const { notification, setNotification } = UseNotification()
  const timeout = useRef()

  const notify = (message, type = 'success', timeoutSeconds = 5) => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
    setNotification({ message, type })
    timeout.current = setTimeout(() => {
      setNotification(null)
    }, timeoutSeconds * 1000)
  }

  return { notification, setNotification: notify }
}

export default useNotification