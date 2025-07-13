import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import './Navbar.css';

function Navbar() {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const userInfo = localStorage.getItem('user');
        if (userInfo) {
            const userData = JSON.parse(userInfo);
            setUser(userData);
            setIsAdmin(userData.isAdmin || userData.email === 'admin@auction.com');
        }
    }, []);

    const handleLogout = () => {
        navigate('/logout');
    };

    // Function to check if a link is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="navbar-container">
            <div className="heading">
                <h1 className="main-title">ONLINE AUCTION SYSTEM</h1>
                <h2 className="sub-title">Welcome To Home Page!</h2>
            </div>
            
            {user && (
                <div className="user-info">
                    <span>Welcome,</span>
                    <span className="user-name">{user.name}!</span>
                    {isAdmin && <span className="admin-badge">Admin</span>}
                    <button onClick={handleLogout} className="logout-btn-small">Logout</button>
                </div>
            )}
            
            <nav className="nav-options">
                <ul className="nav-list">
                    <li>
                        <Link 
                            className={`nav-link ${isActive('/home') ? 'nav-link-active' : ''}`} 
                            to="/home"
                        >
                            HOME
                        </Link>
                    </li>
                    {user && (
                        <>
                            <li>
                                <Link 
                                    className={`nav-link ${isActive('/sell') ? 'nav-link-active' : ''}`} 
                                    to="/sell"
                                >
                                    SELL
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    className={`nav-link ${isActive('/viewbids') ? 'nav-link-active' : ''}`} 
                                    to="/viewbids"
                                >
                                    VIEW ALL BIDS
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    className={`nav-link ${isActive('/winner') ? 'nav-link-active' : ''}`} 
                                    to="/winner"
                                >
                                    BID WINNERS
                                </Link>
                            </li>
                        </>
                    )}
                    <li>
                        <Link 
                            className={`nav-link ${isActive('/aboutus') ? 'nav-link-active' : ''}`} 
                            to="/aboutus"
                        >
                            ABOUT US
                        </Link>
                    </li>
                    {!user && (
                        <>
                            <li>
                                <Link 
                                    className={`nav-link ${isActive('/signin') ? 'nav-link-active' : ''}`} 
                                    to="/signin"
                                >
                                    SIGN IN
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    className={`nav-link ${isActive('/signup') ? 'nav-link-active' : ''}`} 
                                    to="/signup"
                                >
                                    SIGN UP
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            <footer className="footer"></footer>
        </div>
    );
}

export default Navbar;





