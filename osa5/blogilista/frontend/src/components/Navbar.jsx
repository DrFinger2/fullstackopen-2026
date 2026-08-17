import { Link, useLocation  } from 'react-router-dom'
import Notification from './Notification'
import { Nav, NavLinks, UserSection } from '../styles/Navbar.styles'
import { Paragraph } from '../styles/Page.styles'
import { Button } from '../styles/Button.styles'
import { ToggleGroup, ToggleOption } from '../styles/Button.styles'
function Navbar({ user, onLogout, notification }) {
  const userExists = Boolean(user)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isNew = location.pathname === '/blogs/new'

  return (
    <Nav>
      <ToggleGroup>
        <ToggleOption as={Link} to="/" $active={isHome}>
          Home
        </ToggleOption>
        {userExists && (
          <ToggleOption as={Link} to="/blogs/new" $active={isNew}>
            New Blog
          </ToggleOption>
        )}
      </ToggleGroup>


      <Notification message={notification.message} type={notification.type} id={notification.id} />

      <UserSection>
        {userExists ? (
          <>
            <Paragraph>Logged in as: <span className="username">{user}</span></Paragraph>
            <Button onClick={onLogout}>Logout</Button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </UserSection>
    </Nav>
  )
}

export default Navbar