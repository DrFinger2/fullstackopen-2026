import { useState, useEffect } from 'react'
import blogService from './services/blogService'

const Blog = ({blog}) => {
  return (
    <li>
      <a href={blog.url} className="title-link">
        <h3 className="title-text"><span></span>{blog.title}</h3>
      </a>
      <span className="author"> <strong>Author:</strong> {blog.author} </span>
      <span className="likes"> <strong>Likes: </strong> {blog.likes} </span>
    </li>
  )
}

const MainTitle = ({ text }) => {
  return (
    <h1 className="main-title" >
      <span data-text="{">{'{'}</span>
        {text}
      <span data-text="}">{'}'}</span>
    </h1>
  )
}

function App() {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    blogService.getAll().then((result) => {
      setBlogs(result);
    })
    
    console.log("Blogs fetched!");
  }, [])

  console.log(blogs)

  return (
    <div className = "main-container">
      <MainTitle text={'Blogs'}/>
      <ul>
        {
          blogs.map((blog) => (<Blog blog={ blog }/>))
        }
        </ul>
      
    </div>
  )
}

export default App
