import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './CreateAuction.css';

const CreateAuction = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        startingPrice: '',
        startTime: '',
        endTime: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = React.useRef(null);

    const categories = [
        'Electronics', 'Fashion', 'Home & Garden', 'Sports', 
        'Collectibles', 'Art', 'Vehicles', 'Others'
    ];

    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragOver = (e) => {
        preventDefaults(e);
        setIsDragging(true);
    };

    const handleDragEnter = (e) => {
        preventDefaults(e);
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        preventDefaults(e);
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        preventDefaults(e);
        setIsDragging(false);
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.match('image.*')) {
                handleImageFile(file);
            } else {
                setError('Please upload an image file');
            }
        }
    };

    const handleImageFile = (file) => {
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError('Image size should be less than 10MB');
                return;
            }
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        handleImageFile(file);
    };

    const handleBrowseClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.title.length > 50) {
            setError('Title must be less than 50 characters');
            setLoading(false);
            return;
        }

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            
            const formDataToSend = new FormData();
            formDataToSend.append('image', selectedImage);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('startingPrice', formData.startingPrice);
            formDataToSend.append('startTime', formData.startTime);
            formDataToSend.append('endTime', formData.endTime);
            formDataToSend.append('sellerId', userInfo.id);

            const response = await api.createAuction(formDataToSend);
            if (response.data) {
                navigate('/seller-dashboard');
            }
        } catch (error) {
            console.error('Error creating auction:', error);
            setError(error.response?.data?.message || 'Failed to create auction');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title' && value.length > 50) {
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="create-auction-page">
            <div className="container">
                <h2>Create New Auction</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="auction-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            maxLength={50}
                            placeholder="Enter auction title (max 50 characters)"
                        />
                        <small className="form-text text-muted">
                            {formData.title.length}/50 characters
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            maxLength={1000}
                            placeholder="Describe your item in detail (max 1000 characters)... Include condition, features, and any important details buyers should know."
                            rows="5"
                        />
                        <small className="form-text text-muted">
                            {formData.description.length}/1000 characters
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="startingPrice">Starting Price (₹)</label>
                        <input
                            type="number"
                            id="startingPrice"
                            name="startingPrice"
                            value={formData.startingPrice}
                            onChange={handleChange}
                            min="0"
                            required
                            placeholder="Enter starting price"

                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="startTime">Start Time</label>
                        <input
                            type="datetime-local"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            min={new Date().toISOString().slice(0, 16)}
                            required
                            placeholder="Select start time"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endTime">End Time</label>
                        <input
                            type="datetime-local"
                            id="endTime"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            min={formData.startTime || new Date().toISOString().slice(0, 16)}
                            required
                            placeholder="Select end time"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Item Image</label>
                        <div 
                            className={`image-upload-container ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {!imagePreview ? (
                                <>
                                    <div className="upload-instructions">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <p>Drag and drop image here or</p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            id="image"
                                            name="image"
                                            
                                            accept="image/jpeg,image/png,image/jpg"
                                            onChange={handleImageChange}
                                            required
                                            style={{ display: 'none' }}
                                        />
                                        <button 
                                            type="button"
                                            className="browse-button"
                                            onClick={handleBrowseClick}
                                            
                                        >
                                            Browse Files
                                        </button>
                                    </div>
                                    <small className="form-text text-muted">
                                        Supported formats: JPG, JPEG, PNG. Maximum size: 10MB
                                    </small>
                                </>
                            ) : (
                                <div className="image-preview-container">
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                    <button 
                                        type="button" 
                                        className="remove-image"
                                        onClick={() => {
                                            setSelectedImage(null);
                                            setImagePreview(null);
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Auction'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAuction;
