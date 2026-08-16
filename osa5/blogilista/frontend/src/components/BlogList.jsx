import Blog from './Blog'

function BlogList({ blogs }) {
  return (
    <div className="blog-list">
      {blogs?.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogList