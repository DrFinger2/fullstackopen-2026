import { useState } from 'react'
import Header from './Header'

const Blog = ({ blog, user, onLikeClicked, onBlogRemoved }) => {
  const [visible, setVisible] = useState(false)

  const buttonText = !visible ? 'View details' : 'Hide details'
  const className = `blog-card-details ${visible ? 'show' : ''}`

  // event handlers
  const handleLikeClick = () => {
    onLikeClicked(blog.id)
  }
  const handleToggleClick = () => {
    setVisible(!visible)
  }
  const handleRemoveClick = () => {
    if (!window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      return
    }

    onBlogRemoved(blog.id)
  }

  console.log('Blog.user.username: ', blog.user.username)
  console.log('User: ', user)
  return (
    <div className='blog-card'>
      <Header text={blog.title} href={blog.url} />
      <button onClick={handleToggleClick}>
        {buttonText}
      </button>

      <div className={className}>
        <p><strong>Author: </strong>{blog.author}</p>
        <p>
          <strong> Likes: </strong>{blog.likes}
          <button onClick={handleLikeClick}>Like</button>
        </p>
        {
          blog.user.username === user &&
          <button onClick={handleRemoveClick}>Remove</button>
        }
      </div>
    </div>
  )
}

export default Blog