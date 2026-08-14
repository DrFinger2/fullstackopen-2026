const Navbar = ({ user, onLogout }) => {
    return (
        <nav className="navbar">
            <a href="/">Home</a>

            {user && (
                <>
                    <p>Logged in as: <span className="username">{ user }</span></p>
                    <button onClick={onLogout}>
                        Logout
                    </button>
                </>
            )}
        </nav>
    )
}

export default Navbar