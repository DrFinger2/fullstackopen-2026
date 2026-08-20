import { Link } from 'react-router-dom'
import { Card, H3, Paragraph } from '../styles/Page.styles'

function Blog({ blog }) {
  throw new Error('Helloworld!')

  return (
    <Card data-testid="blog-card">
      <Link to={`/blogs/${blog.id}`}>
        <H3>{blog.title}</H3>
      </Link>
      <Paragraph>
        <strong>Author: </strong>{blog.author}
      </Paragraph>
    </Card>
  )
}

export default Blog