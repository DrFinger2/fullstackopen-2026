import Header from './Header'

function BlogDetails({ blog, user, onLike, onRemove }) {
  const isOwner = user && blog.user?.username === user
  return (
    <div className="blog-details-page">
      <Header text={blog.title} />
      <p><strong>URL: </strong> <a href={blog.url}> {blog.url} </a> </p>
      <p><strong>Author: </strong> {blog.author} </p>
      <p><strong>Likes: </strong> {blog.likes} {user && <button onClick={onLike}>Like</button> }</p>
      <p><strong>Added by: </strong> {blog.user?.name || 'Unknown' } </p>
      {isOwner && <button onClick={onRemove}>Remove</button>}
    </div>
  )
}

export default BlogDetails