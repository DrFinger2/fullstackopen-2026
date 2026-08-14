const Navbar = ({ user, onLogout }) => {
    return (
        <nav className="navbar">
            <a href="/">Home</a>

            {user && (
                <button onClick={onLogout}>
                    Logout
                </button>
            )}
        </nav>
    )
}

export default Navbar