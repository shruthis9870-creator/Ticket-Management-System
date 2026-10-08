import { Link, NavLink, useLocation } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const isJourneyPage = ["/search", "/booking"].includes(location.pathname);

    return (
        <nav className="navbar">

            <div className="nav-container">

                <Link to="/" className="logo">
                    🚆 RailEase
                </Link>

                <div className="nav-links">

                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive || isJourneyPage ? "active" : ""
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink to="/reservations">
                        My Reservations
                    </NavLink>

                    <NavLink to="/admin">
                        Admin
                    </NavLink>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;