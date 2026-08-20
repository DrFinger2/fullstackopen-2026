import { useState, useEffect } from 'react'
import blogService from '../services/blogs'

const useAuth = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userJson = window.localStorage.getItem('user')
    if (userJson) {
      const parsedUser = JSON.parse(userJson)
      setUser(parsedUser.username)
      blogService.setToken(parsedUser.token)
    }
  }, [])

  const login = (userObj) => {
    setUser(userObj.username)
    blogService.setToken(userObj.token)
    window.localStorage.setItem('user', JSON.stringify(userObj))
  }

  const logout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('user')
  }

  return { user, login, logout }
}

export default useAuth