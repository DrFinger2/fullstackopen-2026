import { useState } from 'react'

const useNotification = () => {
  const [notification, setNotification] = useState({ message: '', type: '', id: 0 })

  const notify = {
    success: message => setNotification(prev => ({
      message,
      type: 'success',
      id: prev.id + 1
    })),

    error: message => setNotification(prev => ({
      message,
      type: 'error',
      id: prev.id + 1
    }))
  }

  return { notification, notify }
}

export default useNotification