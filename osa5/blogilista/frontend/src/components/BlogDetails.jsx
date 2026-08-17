import { Card, Title, Paragraph } from '../styles/Page.styles'
import { ActionButton } from '../styles/Button.styles'

function BlogDetails({ blog, user, onLike, onRemove }) {
  const isOwner = user && blog.user?.username === user
  return (
    <Card>
      <Title>{blog.title}</Title>
      <Paragraph><strong>URL: </strong> <a href={blog.url}> {blog.url} </a> </Paragraph>
      <Paragraph><strong>Author: </strong> {blog.author} </Paragraph>
      <Paragraph><strong>Likes: </strong> {blog.likes} {user && <ActionButton onClick={onLike}>Like</ActionButton> }</Paragraph>
      <Paragraph><strong>Added by: </strong> {blog.user?.name || 'Unknown' } </Paragraph>
      {isOwner && <ActionButton onClick={onRemove}>Remove</ActionButton>}
    </Card>
  )
}

export default BlogDetails