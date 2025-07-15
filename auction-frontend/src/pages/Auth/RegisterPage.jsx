import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';
import api from '../../services/api';

const RegisterPage = ({ handleLogin }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType.toUpperCase() // Convert to uppercase
      };

      const response = await api.registerUser(userData);

      // Update global auth state
      handleLogin(response.data);

      // Redirect based on user type
      navigate(response.data.userType === 'SELLER' ? '/seller-dashboard' : '/bidder-dashboard');
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, userType: type.toLowerCase() }));
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: ''
    });
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
                  onClick={() => handleUserTypeSelect('BIDDER')}
                >
                  <img src="/bidder.png" alt="Bidder" className="role-icon" />
                  <span>Register as Bidder</span>
                  <small>I want to bid on items</small>
                </button>
                <button 
                  className="selection-button"
                  onClick={() => handleUserTypeSelect('SELLER')}
                >
                  <img src="/seller.png" alt="Seller" className="role-icon" />
                  <span>Register as Seller</span>
                  <small>I want to sell items</small>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="form-header">
                <button className="back-button" onClick={handleBack}>←</button>
                <h2 className="auth-title">Register as {formData.userType}</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control ${errors.name ? 'error' : ''}`}
                    required
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? 'error' : ''}`}
                    required
                    autoComplete="email"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-control ${errors.password ? 'error' : ''}`}
                    required
                    autoComplete="new-password"
                    minLength="8"
                  />
                  <small className="form-hint">Password must be at least 8 characters</small>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                    required
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary auth-button ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="auth-footer">
                <p>Already have an account? <Link to="/login">Login</Link></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
