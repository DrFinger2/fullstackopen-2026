import { useState } from 'react'

const useBlogs = () => {
  const [blogs, setBlogs] = useState([])

  const sortByLikes = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }
  const add = (blog) => {
    setBlogs(sortByLikes(blogs.concat(blog)))
  }
  const update = (updatedBlog) => {
    setBlogs(sortByLikes(
      blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
    ))
  }
  const set = (newBlogs) => {
    setBlogs(sortByLikes(newBlogs))
  }
  const remove = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  return {
    blogs,
    set,
    add,
    remove,
    update
  }
}

export default useBlogs