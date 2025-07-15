import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';
import api from '../../services/api';

const LoginPage = ({ handleLogin }) => {
  const [showForm, setShowForm] = useState(false);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await api.loginUser(formData);
      
      // Check if logged in user type matches selected type
      if (response.data.userType !== formData.userType) {
        setErrors({
          submit: `Role mismatch: Please log in as the correct user type to continue.`
        });
        return;
      }

      handleLogin(response.data);
      navigate('/');
    } catch (error) {
      setErrors({
        submit: 'Invalid email or password. Please try again.'
      });
    }
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setFormData(prev => ({ ...prev, userType: type }));
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setUserType('');
    setFormData({ email: '', password: '', userType: '' });
    setErrors({});
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          {!showForm ? (
            <div className="user-type-selection">
              <h2 className="auth-title">Choose Account Type</h2>
              <div className="selection-buttons">
                <button 
                  className="selection-button"
                  data-type="bidder"
                  onClick={() => handleUserTypeSelect('BIDDER')}
                >
                  <img src="/bidder.png" alt="Bidder" className="role-icon" />
                  <span>Login as Bidder</span>
                  <small>I want to bid on items</small>
                </button>
                <button 
                  className="selection-button"
                  data-type="seller"
                  onClick={() => handleUserTypeSelect('SELLER')}
                >
                  <img src="/seller.png" alt="Seller" className="role-icon" />
                  <span>Login as Seller</span>
                  <small>I want to sell items</small>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="form-header">
                <button className="back-button" onClick={handleBack}>←</button>
                <h2 className="auth-title">Login as {userType.toLowerCase()}</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="auth-form">
                {errors.submit && (
                  <div className="auth-error">{errors.submit}</div>
                )}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary auth-button"
                >
                  Login
                </button>
              </form>

              <div className="auth-footer">
                <p>Don't have an account? <Link to="/register">Create one</Link></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
