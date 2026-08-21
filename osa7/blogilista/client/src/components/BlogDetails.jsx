import { Card, Title, Paragraph } from '../styles/Page.styles'
import { Wrapper } from '../styles/Page.styles'
import { ActionButton } from '../styles/Button.styles'
import { Link } from 'react-router-dom'
import CommentForm from './CommentForm'
function BlogDetails({ blog, user, onLike, onRemove, onComment }) {
  const isOwner = user && blog.user?.username === user

  return (
    <Card>
      <Title>{blog.title}</Title>
      <Wrapper $alignX="left">
        <Paragraph>
          <strong>URL: </strong> <a href={blog.url}> {blog.url} </a>{' '}
        </Paragraph>

        <Paragraph>
          <strong>Author: </strong> {blog.author}{' '}
        </Paragraph>
        <Paragraph>
          <strong>Likes: </strong> {blog.likes}{' '}
          {user && <ActionButton onClick={onLike}>Like</ActionButton>}
        </Paragraph>

        <Paragraph>
          <strong>Added by: </strong>{' '}
          <Link to={`/users/${blog.user?.username}`}>
            {blog.user?.name || 'Unknown'}{' '}
          </Link>{' '}
        </Paragraph>
      </Wrapper>
      {isOwner && <ActionButton onClick={onRemove}>Remove</ActionButton>}

      <CommentForm user={user} onSubmit={onComment}></CommentForm>
    </Card>
  )
}

export default BlogDetails
