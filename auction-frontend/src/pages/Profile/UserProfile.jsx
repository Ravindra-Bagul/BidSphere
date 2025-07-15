import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './UserProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        location: '',
        phone: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo) {
                    navigate('/login');
                    return;
                }

                const response = await api.getUserById(userInfo.id);
                setUser(response.data);
                setFormData({
                    name: response.data.name,
                    email: response.data.email,
                    location: response.data.location || '',
                    phone: response.data.phone || ''
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.updateUser(user.id, formData);
            setEditing(false);
            setUser({ ...user, ...formData });
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) return <div className="loading">Loading profile...</div>;

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-card">
                    <h2>My Profile</h2>
                    <div className="profile-type-badge">{user?.userType}</div>

                    {editing ? (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <div className="info-row">
                                <span className="label">Name:</span>
                                <span className="value">{user?.name}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Email:</span>
                                <span className="value">{user?.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Location:</span>
                                <span className="value">{user?.location || 'Not specified'}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Phone:</span>
                                <span className="value">{user?.phone || 'Not specified'}</span>
                            </div>
                            <button 
                                className="btn btn-primary edit-button"
                                onClick={() => setEditing(true)}
                            >
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
