import { useState } from 'react'

const useBlogs = () => {
  const [blogs, setBlogs] = useState([])

  const sortByLikes = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }
  const add = (blog) => {
    setBlogs(sortStrategy(blogs.concat(blog)))
  }
  const update = (updatedBlog) => {
    setBlogs(sortStrategy(
      blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
    ))
  }
  const set = (newBlogs) => {
    setBlogs(sortStrategy(newBlogs))
  }
  const remove = (id) => {
    set(blogs.filter(blog => blog.id !== id))
  }

  const sortStrategy = sortByLikes

  return {
    blogs,
    set,
    add,
    remove,
    update
  }
}

export default useBlogs