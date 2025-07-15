import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './BidderDashboard.css';

const POLLING_INTERVAL = 5000;

const BidderDashboard = () => {
    const [activeBids, setActiveBids] = useState([]);
    const [wonAuctions, setWonAuctions] = useState([]);
    const [pastBids, setPastBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active');
    const [userStats, setUserStats] = useState({
        name: '',
        email: '',
        totalBids: 0,
        totalSpent: 0,
        wonAuctions: 0
    });
    const navigate = useNavigate();

    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (bid) => {
        try {
            const res = await initializeRazorpay();
            if (!res) {
                alert('Razorpay SDK failed to load');
                return;
            }

            // Create order
            const orderData = await api.createPaymentOrder({
                bidId: bid.id,
                amount: bid.amount
            });

            console.log('Order created:', orderData); // Debug log

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "BidSphere",
                description: `Payment for ${bid.auction?.title || 'Auction Item'}`,
                order_id: orderData.orderId,
                handler: async function(response) {
                    try {
                        const verificationResult = await api.verifyPayment({
                            bidId: bid.id,
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature
                        });

                        if (verificationResult.status === 'success') {
                            alert('Payment successful!');
                            // Update the specific bid's payment status in wonAuctions
                            setWonAuctions(prevAuctions => 
                                prevAuctions.map(auction => 
                                    auction.id === bid.id 
                                        ? {...auction, paymentStatus: 'PAID'} 
                                        : auction
                                )
                            );

                            // Fetch updated user stats to reflect new total spent
                            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                            const statsResponse = await api.getBidderStats(userInfo.id);
                            setUserStats(prev => ({
                                ...prev,
                                totalSpent: statsResponse.data.totalSpent || 0
                            }));
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        alert('Payment verification failed: ' + (error.response?.data?.message || 'Please contact support'));
                    }
                },
                prefill: {
                    name: userStats.name || '',
                    email: userStats.email || ''
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error('Payment initialization failed:', error);
            alert('Failed to initialize payment: ' + (error.response?.data?.message || 'Please try again'));
        }
    };

    const getImageUrl = (bid) => {
        if (bid.auction?.imageData) {
            return `data:image/jpeg;base64,${bid.auction.imageData}`;
        }
        if (bid.imageData) {
            return `data:image/jpeg;base64,${bid.imageData}`;
        }
        return 'https://via.placeholder.com/300';
    };

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || userInfo.userType !== 'BIDDER') {
                    navigate('/login');
                    return;
                }

                const bidsResponse = await api.getBidderBids(userInfo.id);
                const now = new Date();

                // Split bids into three categories
                const active = [];
                const won = [];
                const past = [];

                bidsResponse.data.forEach(bid => {
                    const endTime = new Date(bid.auctionEndTime);
                    const isEnded = endTime <= now;
                    const isWinning = bid.amount >= (bid.auctionCurrentPrice || 0);

                    if (!isEnded) {
                        active.push({
                            ...bid,
                            bidStatus: isWinning ? 'Leading' : 'Outbid'
                        });
                    } else if (isEnded && isWinning) {
                        won.push(bid);
                    } else if (isEnded && !isWinning) {
                        past.push(bid);
                    }
                });

                setActiveBids(active);
                setWonAuctions(won);
                setPastBids(past);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bids:', error);
                setLoading(false);
            }
        };

        const fetchUserStats = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo?.id) return;

                const response = await api.getBidderStats(userInfo.id);
                const stats = response.data;

                setUserStats({
                    name: stats.name || userInfo.name,
                    email: stats.email || userInfo.email,
                    totalBids: stats.totalBids || 0,
                    wonAuctions: stats.wonAuctions || 0,
                    totalSpent: stats.totalSpent || 0 // Use backend value directly
                });
            } catch (error) {
                console.error('Error fetching user stats:', error);
            }
        };

        fetchBids();
        fetchUserStats();
        // Setup polling
        const bidsInterval = setInterval(fetchBids, POLLING_INTERVAL);
        const statsInterval = setInterval(fetchUserStats, POLLING_INTERVAL);

        return () => {
            clearInterval(bidsInterval);
            clearInterval(statsInterval);
        };
    }, [navigate]); // Only run once on mount

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const BidsTable = ({ bids, type }) => (
        <table className="dashboard-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Your Bid</th>
                    <th>Final Price</th>
                    <th>End Date</th>
                    {type === 'active' && <th>Bid Status</th>}
                    {type === 'won' && <th>Payment Status</th>}
                </tr>
            </thead>
            <tbody>
                {bids.map(bid => (
                    <tr key={bid.id}>
                        <td>
                            <div className="item-cell">
                                <div className="item-image">
                                    <img src={getImageUrl(bid)} alt={bid.auction?.title || 'Auction Item'} />
                                </div>
                                <div className="item-title">
                                    <Link to={`/auction/${bid.auctionId}`}>
                                        {bid.auction?.title || bid.auctionTitle || 'Unnamed Auction'}
                                    </Link>
                                </div>
                            </div>
                        </td>
                        <td className="text-right">{formatINR(bid.amount || 0)}</td>
                        <td className="text-right">{formatINR(bid.auctionCurrentPrice || bid.currentPrice || bid.amount || 0)}</td>
                        <td className="text-center">
                            {new Date(bid.auctionEndTime).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </td>
                        {type === 'active' && (
                            <td className="text-center">
                                <span className={`bid-status-badge ${bid.bidStatus?.toLowerCase()}`}>
                                    {bid.bidStatus}
                                </span>
                            </td>
                        )}
                        {type === 'won' && (
                            <td className="text-center">
                                {bid.paymentStatus === 'PAID' ? (
                                    <span className="payment-status paid">Paid</span>
                                ) : (
                                    <button 
                                        className="btn btn-primary btn-sm pay-now-btn"
                                        onClick={() => handlePayment(bid)}
                                    >
                                        Pay Now
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const getBidStatus = (bid, type) => {
        switch (type) {
            case 'active':
                return bid.status || 'Pending';
            case 'won':
                return bid.status || 'Won';
            case 'past':
                return bid.status || 'Lost';
            default:
                return '';
        }
    };

    const getBidStatusClass = (bid, type) => {
        const status = bid.status ? bid.status.toLowerCase() : '';
        switch (type) {
            case 'active':
                return status === 'leading' ? 'leading' : 'outbid';
            case 'won':
                return 'won';
            case 'past':
                return 'lost';
            default:
                return '';
        }
    };

    const renderPaymentColumn = (bid, type) => {
        if (type === 'won') {
            if (bid.paymentStatus === 'PAID') {
                return <span className="status-badge paid">Paid</span>;
            }
            return (
                <button 
                    className="btn btn-primary btn-sm pay-now-btn"
                    onClick={() => handlePayment(bid)}
                >
                    Pay Now
                </button>
            );
        }
        return null;
    };

    if (loading) {
        return <div className="loading">Loading your bids...</div>;
    }

    return (
        <div className="bidder-dashboard">
            <div className="dashboard-header">
                <h1>Bidder Dashboard</h1>
            </div>
            <div className="container">
                <div className="user-stats-grid">
                    <div className="stats-card user-info">
                        <h3>Profile Info</h3>
                        <p><strong>Name:</strong> {userStats.name}</p>
                        <p><strong>Email:</strong> {userStats.email}</p>
                    </div>
                    <div className="stats-card">
                        <h3>Total Bids</h3>
                        <div className="stats-value">{userStats.totalBids}</div>
                    </div>
                    <div className="stats-card">
                        <h3>Won Auctions</h3>
                        <div className="stats-value">{userStats.wonAuctions}</div>
                    </div>
                    <div className="stats-card">
                        <h3>Total Spent</h3>
                        <div className="stats-value">{formatINR(userStats.totalSpent)}</div>
                    </div>
                </div>
                <div className="dashboard-content">
                    <div className="dashboard-tabs">
                        <button
                            className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
                            onClick={() => setActiveTab('active')}
                        >
                            Active Bids
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'won' ? 'active' : ''}`}
                            onClick={() => setActiveTab('won')}
                        >
                            Won Auctions
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
                            onClick={() => setActiveTab('past')}
                        >
                            Past Bids
                        </button>
                    </div>

                    <div className="dashboard-table-container">
                        {activeTab === 'active' && (
                            <div className="active-bids">
                                <h2 className="table-title">Your Active Bids</h2>
                                {activeBids.length > 0 ? (
                                    <BidsTable bids={activeBids} type="active" />
                                ) : (
                                    <div className="no-items">No active bids</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'won' && (
                            <div className="won-auctions">
                                <h2 className="table-title">Won Auctions</h2>
                                {wonAuctions.length > 0 ? (
                                    <BidsTable bids={wonAuctions} type="won" />
                                ) : (
                                    <div className="no-items">No won auctions</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'past' && (
                            <div className="past-bids">
                                <h2 className="table-title">Past Bids</h2>
                                {pastBids.length > 0 ? (
                                    <BidsTable bids={pastBids} type="past" />
                                ) : (
                                    <div className="no-items">No past bids</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BidderDashboard;
