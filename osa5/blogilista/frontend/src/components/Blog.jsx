import Header from './Header'

const Blog = ({ blog }) => {
  
  <div className="blog-card">
    <Header text={blog.title} href={blog.url} />
    <strong>Author: </strong>{blog.author}
  </div>
}

export default Blog