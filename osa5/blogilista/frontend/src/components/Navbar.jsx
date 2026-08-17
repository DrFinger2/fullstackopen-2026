import { Link } from 'react-router-dom'
import Notification from './Notification'


function Navbar({ user, onLogout, notification }) {
  const userExists = Boolean(user)

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/">Home</Link>
        { userExists && <Link to="/blogs/new">New blog</Link> }
      </div>

      <Notification message={notification.message} type={notification.type} id={notification.id}/>

      <div className="navbar-user">
        { userExists ? (
          <> <p>Logged in as: <span className="username">{user}</span></p>
            <button onClick={onLogout}>Logout</button> </>
        ) : (
          <Link to="/login">Login</Link>
        ) }
      </div>
    </nav>
  )
}

export default Navbar