import Blog from './Blog'

const BlogList = ({ blogs, user, onLikeClicked, onBlogRemoved }) => {
  return (
    <div className='blog-list'>
      {blogs?.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          onLikeClicked={onLikeClicked}
          onBlogRemoved={onBlogRemoved}
        />)}
    </div>
  )
}

export default BlogList