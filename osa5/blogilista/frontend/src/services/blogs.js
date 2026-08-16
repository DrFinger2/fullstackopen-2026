import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Loader from '../components/Loader'
import blogService from '../services/blogs'

const BlogDetailsPage = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const fetchedBlog = await blogService.get(id)
        setBlog(fetchedBlog)
      } catch (error) {
        console.error('Error fetching blog:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  if (loading) {
    return (
      <div className='blog-details-container'>
        <Loader isLoading={loading} />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className='blog-details-container'>
        <p>Blog not found.</p>
      </div>
    )
  }

  const handleLike = async () => {
    try {
      const updatedBlog = await blogService.like(blog)
      setBlog(updatedBlog)
    } catch (error) {
      console.error('Error liking blog:', error)
    }
  }

  const handleRemove = async () => {
    const title = `Remove blog "${blog.title}" by ${blog.author}?`
    if (!window.confirm(title)) {
      return
    }
    try {
      await blogService.remove(blog.id)
      navigate('/blogs')
    } catch (error) {
      console.error('Error removing blog:', error)
    }
  }

  const isUserName = (blog.user?.username === user?.username)
  return (
    <div className='blog-details-container'>
      <Header text={blog.title} />
      <p><strong>URL: </strong><a href={blog.url} target='_blank' rel='noreferrer'>{blog.url}</a></p>
      <p><strong>Author: </strong>{blog.author}</p>
      <p> <strong>Likes: </strong>{blog.likes} <button onClick={handleLike}>Like</button> </p>
      <p> <strong>Added by: </strong>{blog.user?.name || blog.user?.username || 'Unknown'}</p>
      { isUserName && ( <button onClick={handleRemove}>Remove Blog</button> )}
    </div>
  )
}

export default BlogDetailsPage