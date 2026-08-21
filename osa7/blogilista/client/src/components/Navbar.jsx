import { Link, useLocation } from 'react-router-dom'
import Notification from './Notification'
import { Nav, NavLinks, UserSection } from '../styles/Navbar.styles'
import { Paragraph } from '../styles/Page.styles'
import { Button } from '../styles/Button.styles'
import { ToggleGroup, ToggleOption } from '../styles/Button.styles'
import { useUser, useUserActions } from '../hooks/useUser'

function Navbar() {
  const user = useUser()
  const actions = useUserActions()

  const userExists = Boolean(user)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isNew = location.pathname === '/blogs/new'
  const isUsers = location.pathname === '/users'

  return (
    <Nav>
      <ToggleGroup>
        <ToggleOption as={Link} to="/" $active={isHome}>
          Home
        </ToggleOption>
        <ToggleOption as={Link} to="/users" $active={isUsers}>
          Users
        </ToggleOption>
        {userExists && (
          <ToggleOption as={Link} to="/blogs/new" $active={isNew}>
            New Blog
          </ToggleOption>
        )}
      </ToggleGroup>
      <Notification />
      <UserSection>
        {userExists ? (
          <>
            <Paragraph>
              Logged in as: <span className="username">{user}</span>
            </Paragraph>
            <Button onClick={actions.logout}>Logout</Button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </UserSection>
    </Nav>
  )
}

export default Navbar
