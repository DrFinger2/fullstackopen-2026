import { create } from 'zustand'
import blogService from '../services/blogs'
import loginService from '../services/login'
import registerService from '../services/register'
import { useNotificationStore } from './notificationStore'
import persistance from '../services/persistentUser'

const success = (message) =>
  useNotificationStore.getState().actions.success(message)
const failure = (message) =>
  useNotificationStore.getState().actions.error(message)

const useUserStore = create((set) => ({
  username: null,

  actions: {
    init: async () => {
      const user = persistance.getUser()
      if (user) {
        set({ username: user.username })
        blogService.setToken(user.token)
      }
    },
    login: async (userObj) => {
      try {
        const result = await loginService.login(userObj)
        set({ username: result.username })
        blogService.setToken(result.token)
        persistance.saveUser(result)
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
      persistance.removeUser()
      success('Logged out successfully!')
    },
  },
}))

export default useUserStore
