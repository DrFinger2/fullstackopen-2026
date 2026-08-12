import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogService'

const useForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('http://www.example.com/')

  return {
    title,
    author,
    url,
    setTitle,
    setAuthor,
    setUrl
  }
}

const useNotification = (seconds = 5) => {
  const [notification, setNotification] = useState(null)
  const timeoutRef = useRef(null)

  const notify = (type) => (message) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setNotification({ type, message })
    timeoutRef.current = setTimeout(() => setNotification(null), seconds * 1000)
  }

  return {
    notification,
    info: notify('info'),
    error: notify('error'),
    warning: notify('warning')
  }
}

const Notification = ({ notification }) => {
  if (!notification) return null

  return (
    <div className={`notification notification-${notification.type}`}>
      {notification.message}
    </div>
  )
}

const Blog = ({ blog }) => {
  return (
    <div className="blog-card">
      <a href={blog.url} className="title-link">
        <h3 className="title-text">{blog.title}</h3>
      </a>
      <span className="author">
        <strong>Author:</strong> {blog.author}
      </span>
      <span className="likes">
        <strong>Likes: </strong> {blog.likes}
      </span>
    </div>
  )
}

const BlogsTitle = ({ text }) => {
  return (
    <h1 className="blogs-title">
      <span data-text={'{'}>{'{'}</span>
      {text}
      <span data-text={'}'}>{'}'}</span>
    </h1>
  )
}

const BlogForm = ({ form, onSubmit }) => {
  return (
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Title:</label><br />
        <input type="text" id="title" value={form.title} onChange={(e) => form.setTitle(e.target.value)}/><br />

        <label htmlFor="author">Author:</label><br />
        <input type="text" id="author" value={form.author} onChange={(e) => form.setAuthor(e.target.value)}/><br />

        <label htmlFor="url">Url:</label><br />
        <input type="url" id="url" value={form.url} onChange={(e) => form.setUrl(e.target.value)}/><br />
        <input type="submit" value="Submit" />
      </form>
    </>
  )
}

function App() {
  const [blogs, setBlogs] = useState([])
  const form = useForm()
  const { notification, info, error } = useNotification(5)
  
  useEffect(() => {
    blogService.getAll().then((result) => {
      setBlogs(result)
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!window.confirm("Do you want to add a new blog to blogs?")) {
      return;
    }

    const newForm = {
      title: form.title,
      author: form.author,
      url: form.url
    }

    blogService.add(newForm)
      .then((result) => {
        setBlogs(blogs.concat(result))
        info(`a new blog "${result.title}" was added`)
      })
      .catch((err) => {
        error(err.message)
      })
        
  }


  return (
    <div className="page-container">
      <div className="blogform-container">
        <BlogForm
          form={form}
          onSubmit={handleSubmit} />
        <Notification notification={notification} />
      </div>

      <div className="blogs-container">
        <BlogsTitle text="Blogs" />

        <div className="blogs-wrapper">
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
