import Blog from './Blog'

const BlogList = ({ blogs }) => {
  return (
    <div className='blog-list'>
      {blogs?.map(blog => <Blog key={blog.id} blog={blog} />)}
    </div>
  )
}

export default BlogList