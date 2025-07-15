
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mt-20">
      <div className="card p-5 text-center">
        <h1 className="section-title">404 - Page Not Found</h1>
        <p className="mb-20">The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
