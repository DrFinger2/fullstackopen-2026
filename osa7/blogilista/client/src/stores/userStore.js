import { create } from 'zustand'
import blogService from '../services/blogs'
import userService from '../services/user'
import persistance from '../services/persistentUser'
import { useNotificationStore } from './notificationStore'

const success = (message) =>
  useNotificationStore.getState().actions.success(message)

const failure = (message) =>
  useNotificationStore.getState().actions.error(message)

const useUserStore = create((set) => ({
  usersLoading: false,
  username: null,
  users: [],

  actions: {
    init: async () => {
      const user = persistance.getUser()
      if (user) {
        set({ username: user.username })
        blogService.setToken(user.token)
      }
    },
    fetchAll: async () => {
      set({ usersLoading: true })
      try {
        const users = await userService.getAll()
        set({ users })
      } catch (error) {
        failure(error.response?.data?.error)
      } finally {
        set({ usersLoading: false })
      }
    },
    login: async (userObj) => {
      try {
        const result = await userService.login(userObj)
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
        await userService.register(details)
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
