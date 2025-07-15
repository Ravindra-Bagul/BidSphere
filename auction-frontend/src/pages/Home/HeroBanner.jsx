
import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="container">
        <div className="hero-content">
          <h1>Discover Unique Items at Unbeatable Prices</h1>
          <p>Join thousands of buyers and sellers on our trusted auction platform</p>
          <div className="hero-buttons">
            <Link to="/auctions" className="btn btn-primary">Browse Auctions</Link>
            <Link to="/register" className="btn btn-secondary">Join Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
