import { useNavigate, useParams } from 'react-router-dom'
import BlogDetails from '../components/BlogDetails'
import { Wrapper } from '../styles/Page.styles'
import { useBlogs, useBlogActions } from '../hooks/useBlogs'
import { useUser } from '../hooks/useUser'

function BlogDetailsPage() {
  const user = useUser()
  const navigate = useNavigate()
  const actions = useBlogActions()
  const blogs = useBlogs()

  const { id } = useParams()
  const current = blogs?.find((b) => b.id === id)

  if (!current) {
    return (
      <div className="blog-details-container">
        <p>Blog not found</p>
      </div>
    )
  }

  const onLike = () => actions.like(current)

  const onRemove = async () => {
    const message = `Remove blog "${current.title}" by ${current.author}?`
    if (!window.confirm(message)) {
      return
    }

    const removed = await actions.remove(current.id)
    if (removed) {
      navigate('/')
    }
  }

  const onComment = async (blogId, comment) => {
    await actions.addComment(blogId, comment)
  }

  return (
    <Wrapper>
      <BlogDetails
        blog={current}
        user={user}
        onLike={onLike}
        onRemove={onRemove}
        onComment={onComment}
      />
    </Wrapper>
  )
}

export default BlogDetailsPage
