import { Link, useParams } from 'react-router-dom'
import { useUsers } from '../hooks/useUser'
import { Container, Wrapper } from '../styles/Page.styles'
import { Paragraph } from '../styles/Page.styles'
import { Title } from '../styles/Page.styles'
import { UnorderedList, ListItem, OrderedList } from '../styles/List.styles'
import { H3 } from '../styles/Page.styles'
const UserDetailsPage = () => {
  const users = useUsers()
  const { username } = useParams()

  const user = users.find((u) => u.username === username)

  if (!user) {
    return (
      <Container>
        <Paragraph>User not found</Paragraph>
      </Container>
    )
  }

  const hasPost = user.blogs.length > 0
  return (
    <Container $alignX="left">
      <Title $margin="25px 0px 3px 0px" $padding="0px">
        {user.name}
      </Title>
      <Paragraph>
        <strong>username: </strong> {user.username}
      </Paragraph>
      {hasPost ? (
        <Container $alignX="left">
          <OrderedList>
            {user.blogs.map((blog) => {
              return (
                <ListItem key={blog.id}>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </ListItem>
              )
            })}
          </OrderedList>
        </Container>
      ) : (
        <Container>
          <Paragraph>No post found</Paragraph>
        </Container>
      )}
    </Container>
  )
}

export default UserDetailsPage
