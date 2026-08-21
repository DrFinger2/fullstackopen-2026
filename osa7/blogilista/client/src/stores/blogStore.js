import { create } from 'zustand'

const sortByLikes = (blogs) => {
  return blogs.sort((a, b) => b.likes - a.likes)
}

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    add: (blog) => {
      return set((state) => ({
        blogs: sortByLikes([...state.blogs, blog]),
      }))
    },

    update: (updatedBlog) => {
      return set((state) => ({
        blogs: sortByLikes(
          state.blogs.map((blog) =>
            blog.id === updatedBlog.id ? updatedBlog : blog
          )
        ),
      }))
    },

    setAll: (newBlogs) => {
      return set({
        blogs: sortByLikes(newBlogs),
      })
    },

    remove: (id) => {
      return set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id),
      }))
    },
  },
}))

export default useBlogStore
