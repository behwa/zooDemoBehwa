import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Navbar.css';

interface UserData {
    userid: string;
    role: string;
    token: string;
}

const Navbar: React.FC = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        // On mount, load user from localStorage if available
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, [location]);

    const toggleNavbar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        // Optionally reload page or navigate to login
        window.location.reload();
    };

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light sticky-top px-3 navbar-custom"
            aria-label="Main navigation"
        >
            <div className="container-fluid">
                <Link
                    className="navbar-brand fw-bold d-flex align-items-center gap-2"
                    to="/"
                    aria-label="Go to homepage"
                >
                    <img
                        src="/zooPic.png"
                        alt="Logo"
                        height="80"
                        width="80"
                        className="rounded-circle"
                    />
                    Task Management App
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    aria-controls="navbarSupportedContent"
                    aria-expanded={!isCollapsed}
                    aria-label="Toggle navigation"
                    onClick={toggleNavbar}
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div
                    className={`collapse navbar-collapse${isCollapsed ? '' : ' show'}`}
                    id="navbarSupportedContent"
                >
                    <div className="ms-auto d-flex gap-2 align-items-center">
                        {!user ? (
                            <>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'btn btn-outline-primary btn-nav-link active'
                                            : 'btn btn-outline-primary btn-nav-link'
                                    }
                                >
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/signup"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'btn btn-primary btn-nav-link active'
                                            : 'btn btn-primary btn-nav-link'
                                    }
                                >
                                    Sign Up
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <span className="me-3">
                                    Welcome, <strong>{user.userid}</strong> ({user.role})
                                </span>
                                <button className="btn btn-danger" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
