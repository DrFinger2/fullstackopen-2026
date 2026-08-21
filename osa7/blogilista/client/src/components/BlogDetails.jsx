import { Card, Title, Paragraph } from '../styles/Page.styles'
import { Wrapper } from '../styles/Page.styles'
import { ActionButton } from '../styles/Button.styles'
import { Link } from 'react-router-dom'
import { H4 } from '../styles/Page.styles'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
function BlogDetails({ blog, user, onLike, onRemove, onComment }) {
  const isOwner = user && blog.user?.username === user

  return (
    <Card>
      <Wrapper $alignX="left">
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
        <Wrapper $alignX="left">
          <CommentForm
            blogId={blog.id}
            user={user}
            onSubmit={onComment}
          ></CommentForm>
          <Wrapper $alignX="left" $margin="8px auto">
            <H4>Comments</H4>
            <CommentList comments={blog.comments} />
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </Card>
  )
}

export default BlogDetails
