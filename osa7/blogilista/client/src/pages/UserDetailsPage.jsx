import { useParams } from 'react-router-dom'
import { useUserActions } from '../hooks/useUser'
import { Container } from '../styles/Page.styles'
import { Paragraph } from '../styles/Page.styles'
import { Title } from '../styles/Page.styles'

const UserDetailsPage = () => {
  const actions = useUserActions()
  const { username } = useParams()

  const user = actions.getDetails(username)
  if (!user) {
    throw new Error('Invalid username')
  }

  return (
    <Container>
      <Title>{user.username}</Title>
      {user.blogs.map((blog) => {
        return <Paragrah>{blog.title}</Paragrah>
      })}
      <Paragrah></Paragrah>
    </Container>
  )
}

export default UserDetailsPage
