import Blog from './Blog'

function BlogList({ blogs }) {
  return (
    <>
      {blogs?.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  )
}

export default BlogList