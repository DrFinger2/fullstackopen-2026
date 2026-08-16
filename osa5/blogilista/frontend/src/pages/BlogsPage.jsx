// src/pages/BlogsPage.jsx
import { useRef } from 'react'
import Title from '../components/Title'
import BlogList from '../components/BlogList'
import Togglable from '../components/Togglable'
import BlogForm from '../components/BlogForm'
import blogService from '../services/blogs'

const BlogsPage = ({ user, logout, notify, blogState }) => {
  const createBlogFormRef = useRef()
  const handleCreateBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      blogState.add(createdBlog)
      notify.success(`Added '${createdBlog.title}' successfully!`)
      createBlogFormRef.current.close()
      return true
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        notify.error('Session expired, please log in again')
      } else {
        notify.error(error.response?.data?.error || 'Failed to create blog')
      }
      return false
    }
  }

  const handleLikeBlog = async (blog) => {
    try {
      const updated = await blogService.like(blog)
      blogState.update(updated)
    } catch (error) {
      notify.error(error.response?.data?.error || 'Failed to like blog')
    }
  }

  const handleRemoveBlog = async (blogId) => {
    try {
      await blogService.remove(blogId)
      blogState.remove(blogId)
      notify.success('Blog removed successfully!')
    } catch (error) {
      notify.error(error.response?.data?.error || 'Failed to remove blog')
    }
  }

  return (
    <div className='blog-page'>
      <section className='blog-section'>
        <Title text='Blogs' />
        <BlogList blogs={blogState.blogs} user={user} onLikeClicked={handleLikeBlog} onBlogRemoved={handleRemoveBlog}
        />
      </section>

      <section className='blog-form-section'>
        <Togglable ref={createBlogFormRef} buttonLabel='Add new Blog'>
          <BlogForm onCreateBlog={handleCreateBlog} notify={notify} />
        </Togglable>
      </section>
    </div>
  )
}

export default BlogsPage