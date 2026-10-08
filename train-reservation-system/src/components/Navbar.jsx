import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">

            <div className="nav-container">

                <Link to="/" className="logo">
                    🚆 RailEase
                </Link>

                <div className="nav-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/reservations">
                        My Reservations
                    </Link>

                    <Link to="/admin">
                        Admin
                    </Link>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;