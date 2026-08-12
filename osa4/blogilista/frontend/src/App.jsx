import { useState, useEffect } from 'react'
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
      <span>{'{'}</span>
      {text}
      <span>{'}'}</span>
    </h1>
  )
}

const BlogForm = ({ form, onSubmit }) => {
  return (
    <div className="newblog-container">
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Title:</label><br />
        <input type="text" id="title" value={form.title} onChange={(e) => form.setTitle(e.target.value)}/><br />

        <label htmlFor="author">Author:</label><br />
        <input type="text" id="author" value={form.author} onChange={(e) => form.setAuthor(e.target.value)}/><br />

        <label htmlFor="url">Url:</label><br />
        <input type="url" id="url" value={form.url} onChange={(e) => form.setUrl(e.target.value)}/><br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

function App() {
  const [blogs, setBlogs] = useState([])
  const form = useForm()

  useEffect(() => {
    blogService.getAll().then((result) => {
      setBlogs(result)
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const newForm = {
      title: form.title,
      author: form.author,
      url: form.url
    }

    blogService.add(newForm)
      .then((result) => {
        const copy = blogs.concat(result);
        setBlogs(copy);
        console.log('.then result: ', copy);
      })
      .catch(error => {
        console.log(error);
      })
    
  }


  return (
    <div className="page-container">
      <BlogForm
        form={form}
        onSubmit={handleSubmit}/>

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