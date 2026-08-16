import { Link } from 'react-router-dom'
import Notification from './Notification'

const Navbar = ({ user, onLogout, notification }) => {
  return (
    <nav className='navbar'>
      <div className='navbar-links'>
        <Link to='/'>Home</Link>
        {user && <Link to='/blogs/new'>New blog</Link>}
      </div>

      <Notification message={notification.message} type={notification.type} id={notification.id} />

      <div className='navbar-user'>
        {user ? (
          <>
            <p>Logged in as: <span className='username'>{user}</span></p>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <Link to='/login'>Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar