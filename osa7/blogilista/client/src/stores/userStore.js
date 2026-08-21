import { create } from 'zustand'
import blogService from '../services/blogs'
import loginService from '../services/login'
import registerService from '../services/register'
import { useNotificationStore } from './notificationStore'

const success = (message) =>
  useNotificationStore.getState().actions.success(message)
const failure = (message) =>
  useNotificationStore.getState().actions.error(message)

const useUserStore = create((set) => ({
  username: null,

  actions: {
    init: async () => {
      const userJson = window.localStorage.getItem('user')
      if (userJson) {
        const parsedUser = JSON.parse(userJson)
        set({ username: parsedUser.username })
        blogService.setToken(parsedUser.token)
      }
    },
    login: async (userObj) => {
      try {
        const result = await loginService.login(userObj)
        set({ username: result.username })
        blogService.setToken(result.token)
        window.localStorage.setItem('user', JSON.stringify(result))
        success(`Welcome back, ${result.username}!`)
        return true
      } catch (error) {
        failure(error.response?.data?.error)
        return false
      }
    },
    register: async (details) => {
      try {
        await registerService.register(details)
        success('Registration successful! Please log in.')
        return true
      } catch (error) {
        failure(error.response?.data?.error)
        return false
      }
    },

    logout: async () => {
      set({ username: null })
      blogService.setToken(null)
      window.localStorage.removeItem('user')
      success('Logged out successfully!')
    },
  },
}))

export default useUserStore
