import { create } from 'zustand'
import blogService from '../services/blogs'
import { useNotificationStore } from './notificationStore'
import useUserStore from './userStore'

const sortByLikes = (blogs) => {
  return blogs.sort((a, b) => b.likes - a.likes)
}
const success = (message) => {
  return useNotificationStore.getState().actions.success(message)
}
const failure = (message) => {
  return useNotificationStore.getState().actions.error(message)
}

const handleError = (error) => {
  if (error.response?.status === 401) {
    useUserStore.getState().actions.logout()
    failure('Session expired, please log in again')
  } else {
    failure(error.response?.data?.error)
  }
}

const useBlogStore = create((set) => ({
  blogs: [],
  loading: false,

  actions: {
    fetchAll: async () => {
      set({ loading: true })
      try {
        const data = await blogService.getAll()
        set(() => ({ blogs: sortByLikes(data) }))
      } catch (error) {
        handleError(error)
      } finally {
        set(() => ({ loading: false }))
      }
    },

    create: async (blog) => {
      try {
        const created = await blogService.create(blog)
        set((state) => ({ blogs: sortByLikes([...state.blogs, created]) }))
        success(`Added '${created.title}' successfully!`)
        return created
      } catch (error) {
        handleError(error)
        return null
      }
    },

    like: async (blog) => {
      try {
        const updated = await blogService.like(blog)
        set((state) => ({
          blogs: sortByLikes(
            state.blogs.map((blog) => (blog.id === updated.id ? updated : blog))
          ),
        }))
        return true
      } catch (error) {
        handleError(error)
        return false
      }
    },

    remove: async (id) => {
      try {
        await blogService.remove(id)
        set((state) => ({
          blogs: state.blogs.filter((blog) => blog.id !== id),
        }))
        success('Blog removed successfully!')
        return true
      } catch (error) {
        handleError(error)
        return false
      }
    },
  },
}))

export default useBlogStore
