import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isLoggedIn, userType, handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">BidSphere</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/auctions" className="navbar-link">Auctions</Link>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          ) : userType?.toLowerCase() === 'seller' ? (
            <>
              <Link to="/seller-dashboard" className="navbar-link">Dashboard</Link>
             {/*<Link to="/profile" className="navbar-link">Profile</Link> */}
              <Link to="/create-auction" className="navbar-link">
                Create Auction
              </Link>
              <button onClick={handleLogout} className="navbar-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/bidder-dashboard" className="navbar-link">Dashboard</Link>
              {/*<Link to="/profile" className="navbar-link">Profile</Link> */}
              <button onClick={handleLogout} className="navbar-link logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

