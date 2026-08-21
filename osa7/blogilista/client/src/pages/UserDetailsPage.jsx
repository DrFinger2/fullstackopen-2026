import { useParams } from 'react-router-dom'
import { useUsers } from '../hooks/useUser'
import { Container } from '../styles/Page.styles'
import { Paragraph } from '../styles/Page.styles'
import { Title } from '../styles/Page.styles'

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

  return (
    <Container>
      <Title>{user.username}</Title>
      {user.blogs.map((blog) => {
        return <Paragraph>{blog.title}</Paragraph>
      })}
    </Container>
  )
}

export default UserDetailsPage
