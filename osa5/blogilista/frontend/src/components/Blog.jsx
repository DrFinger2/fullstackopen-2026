import { Link } from 'react-router-dom'
import Header from './Header'

function Blog({ blog }) {
  return (
    <div className="blog-card">
      <Link to={`/blogs/${blog.id}`}>
        <Header text={blog.title} />
      </Link>
      <p>
        <strong>Author: </strong>
        {blog.author}
      </p>
    </div>
  )
}

export default Blog