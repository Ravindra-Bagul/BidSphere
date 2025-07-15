import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './EditAuction.css';

const EditAuction = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [auction, setAuction] = useState({
        title: '',
        description: '',
        category: '',
        startingPrice: '',
        endTime: '',
        imageData: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const categories = [
        'Electronics', 'Fashion', 'Home & Garden', 'Sports', 
        'Collectibles', 'Art', 'Vehicles', 'Others'
    ];
    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const response = await api.getAuctionById(id);
                const auctionData = response.data;
                
                // Format date for input field
                const endTime = new Date(auctionData.endTime)
                    .toISOString()
                    .slice(0, 16);

                setAuction({
                    ...auctionData,
                    endTime
                });
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch auction details');
                setLoading(false);
            }
        };

        fetchAuction();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title' && value.length > 50) {
            return;
        }
        setAuction(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Title validation
        if (!auction.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (auction.title.length > 50) {
            newErrors.title = 'Title must be less than 50 characters';
        }

        // Description validation
        if (!auction.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (auction.description.length >= 1000) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        // Category validation
        if (!auction.category) {
            newErrors.category = 'Category is required';
        }

        // End time validation
        if (!auction.endTime) {
            newErrors.endTime = 'End time is required';
        } else if (new Date(auction.endTime) <= new Date()) {
            newErrors.endTime = 'End time must be in the future';
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
            await api.updateAuction(id, auction);
            alert('Auction updated successfully');
            navigate('/seller-dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update auction');
        }
    };

    if (loading) return <div className="loading">Loading auction details...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="edit-auction-container">
            <h1>Edit Auction</h1>
            <form onSubmit={handleSubmit} className="edit-auction-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={auction.title}
                        onChange={handleChange}
                        maxLength={50}
                        required
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                    <small className="form-text text-muted">
                        {auction.title.length}/50 characters
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={auction.description}
                        onChange={handleChange}
                        rows="4"
                        maxLength={1000}
                        required
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                    <small className="form-text text-muted">
                        {auction.description.length}/1000 characters
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={auction.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                    </select>
                    {errors.category && <span className="error-message">{errors.category}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="endTime">End Time</label>
                    <input
                        type="datetime-local"
                        id="endTime"
                        name="endTime"
                        value={auction.endTime}
                        onChange={handleChange}
                        required
                    />
                     {errors.endTime && <span className="error-message">{errors.endTime}</span>}
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/seller-dashboard')} className="btn-cancel">
                        Cancel
                    </button>
                    <button type="submit" className="btn-save">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditAuction;
