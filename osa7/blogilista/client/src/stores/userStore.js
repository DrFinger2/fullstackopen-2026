import { create } from 'zustand'
import blogService from '../services/blogs'

const useUserStore = () =>
  create((set) => ({
    username: null,

    actions: {
      init: () => {
        const userJson = window.localStorage.getItem('user')
        if (userJson) {
          const parsedUser = JSON.parse(userJson)
          set({ username: parsedUser.username })
          blogService.setToken(parsedUser.token)
        }
      },
      login: (userObj) => {
        set({ username: userObj.username })
        blogService.setToken(userObj.token)
        window.localStorage.setItem('user', JSON.stringify(userObj))
      },

      logout: () => {
        set({ username: null })
        blogService.setToken(null)
        window.localStorage.removeItem('user')
      },
    },
  }))

export default useUserStore
