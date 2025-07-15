import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './SellerHome.css';

const SellerHome = () => {
    const [stats, setStats] = useState({
        activeAuctions: 0,
        totalBids: 0,
        endingSoon: 0,
        recentSales: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const response = await api.getSellerAuctions(userInfo.id);
                const auctions = response.data;

                setStats({
                    activeAuctions: auctions.filter(a => a.status === 'ACTIVE').length,
                    totalBids: auctions.reduce((sum, a) => sum + a.bidCount, 0),
                    endingSoon: auctions.filter(a => 
                        a.status === 'ACTIVE' && 
                        new Date(a.endTime) - new Date() < 24 * 60 * 60 * 1000
                    ).length,
                    recentSales: auctions.filter(a => a.status === 'ENDED').slice(0, 3)
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchSellerData();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="seller-home">
            <div className="welcome-banner seller">
                <div className="container">
                    <h1>Welcome Back, {JSON.parse(localStorage.getItem('userInfo'))?.name}</h1>
                    <Link to="/create-auction" className="btn btn-primary">
                        Create New Auction
                    </Link>
                </div>
            </div>

            <div className="container">
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Active Auctions</h3>
                        <div className="stat-value">{stats.activeAuctions}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Total Bids</h3>
                        <div className="stat-value">{stats.totalBids}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Ending Soon</h3>
                        <div className="stat-value">{stats.endingSoon}</div>
                    </div>
                </div>

                <section className="recent-sales">
                    <h2>Recent Sales</h2>
                    <div className="sales-grid">
                        {stats.recentSales.map(auction => (
                            <div key={auction.id} className="sale-card">
                                <img src={auction.imageUrl} alt={auction.title} />
                                <div className="sale-info">
                                    <h3>{auction.title}</h3>
                                    <p>Final Price: ₹{auction.currentPrice}</p>
                                    <p>Total Bids: {auction.bidCount}</p>
                                    <Link to={`/auction/${auction.id}/result`}>View Details</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="quick-actions">
                    <Link to="/seller-dashboard" className="action-card">
                        Manage Auctions
                    </Link>
                    <Link to="/create-auction" className="action-card">
                        Create Auction
                    </Link>
                    <Link to="/profile" className="action-card">
                        Update Profile
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default SellerHome;
