import Notification from './Notification'

const Navbar = ({ user, onLogout, notification }) => {
    return (
        <nav className="navbar">
            <a href="/">Home</a>
            
             <Notification message={notification.message} type={notification.type} id={notification.id} />
            
            <div className="navbar-user">
                {user && (
                    <>
                        <p>Logged in as: <span className="username">{ user }</span></p>
                        <button onClick={onLogout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar