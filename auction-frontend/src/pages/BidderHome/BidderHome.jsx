import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AuctionCard from '../../components/AuctionCard/AuctionCard';
import './BidderHome.css';

const BidderHome = () => {
    const [recentBids, setRecentBids] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBidderData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const [bidsResponse, activeAuctions] = await Promise.all([
                    api.getBidderBids(userInfo.id),
                    api.getActiveAuctions()
                ]);

                setRecentBids(bidsResponse.data.slice(0, 3));
                setRecommendations(activeAuctions.data.slice(0, 4));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchBidderData();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="bidder-home">
            <div className="welcome-banner">
                <div className="container">
                    <h1>Welcome Back, {JSON.parse(localStorage.getItem('userInfo'))?.name}</h1>
                    <p>Find your next great deal</p>
                </div>
            </div>

            <div className="container">
                <section className="recent-activity">
                    <h2>Your Recent Bids</h2>
                    <div className="bids-grid">
                        {recentBids.map(bid => (
                            <div key={bid.id} className="bid-summary-card">
                                <img src={bid.auctionImageUrl} alt={bid.auctionTitle} />
                                <div className="bid-info">
                                    <h3>{bid.auctionTitle}</h3>
                                    <p>Your bid: ₹{bid.amount}</p>
                                    <p>Current price: ₹{bid.auctionCurrentPrice}</p>
                                    <Link to={`/auction/${bid.auctionId}`}>View Auction</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="recommendations">
                    <h2>Recommended for You</h2>
                    <div className="auctions-grid">
                        {recommendations.map(auction => (
                            <AuctionCard key={auction.id} auction={auction} />
                        ))}
                    </div>
                </section>

                <section className="quick-actions">
                    <Link to="/auctions" className="action-card">
                        Browse All Auctions
                    </Link>
                    <Link to="/bidder-dashboard" className="action-card">
                        View Your Bids
                    </Link>
                    <Link to="/profile" className="action-card">
                        Update Profile
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default BidderHome;
