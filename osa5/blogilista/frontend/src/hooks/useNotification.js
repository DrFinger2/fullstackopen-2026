import { useState } from 'react'

const useNotification = () => {
  const [notification, setNotification] = useState({ error: '', success: '' })

  const notify = (message, type = 'error') => {
    setNotification({
      error: type === 'error' ? message : '',
      success: type === 'success' ? message : ''
    })
  }

  return { notification, notify }
}

export default useNotification