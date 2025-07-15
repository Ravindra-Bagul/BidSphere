import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './SellerDashboard.css';

function formatINR(amount) {
  // Formats a number to INR with commas and ₹ sign
  return (
    "₹" +
    amount
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')
  );
}

const POLLING_INTERVAL = 5000;

const SellerDashboard = () => {
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [pastAuctions, setPastAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [error, setError] = useState(null);
  const [sellerStats, setSellerStats] = useState({
    name: '',
    email: '',
    totalAuctions: 0,
    activeAuctions: 0,
    totalEarnings: 0,
    successfulSales: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || userInfo.userType !== 'SELLER') {
          navigate('/login');
          return;
        }

        // Check if server is running first
        try {
          await api.getAllAuctions(); // Test connection
        } catch (error) {
          console.error('Server connection error:', error);
          setLoading(false);
          return;
        }

        const response = await api.getSellerAuctions(userInfo.id);
        const auctions = response.data;

        setActiveAuctions(auctions.filter(auction => 
          auction.status === 'ACTIVE' && new Date(auction.endTime) > new Date()
        ));
        
        setPastAuctions(auctions.filter(auction => 
          auction.status === 'ENDED' || 
          new Date(auction.endTime) <= new Date()
        ));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching auctions:', error);
        setError(error.message || 'Failed to load auctions');
        setLoading(false);
      }
    };

    const fetchSellerStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const stats = await api.getSellerStats(userInfo.id);
        
        setSellerStats({
          name: stats.name || userInfo.name,
          email: stats.email || userInfo.email,
          totalAuctions: stats.totalAuctions || 0,
          activeAuctions: stats.activeAuctions || 0,
          totalEarnings: stats.totalEarnings || 0
        });
      } catch (error) {
        console.error('Error fetching seller stats:', error);
      }
    };

    fetchData();
    fetchSellerStats();

      // Setup polling
      const dataInterval = setInterval(fetchData, POLLING_INTERVAL);
      const statsInterval = setInterval(fetchSellerStats, POLLING_INTERVAL);
    
      return () => {
        clearInterval(dataInterval);
        clearInterval(statsInterval);
      };
  }, [navigate]);

  const handleDeleteAuction = async (auctionId) => {
    if (!window.confirm('Are you sure you want to delete this auction? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteAuction(auctionId);
      
      // Update both active and past auctions lists
      setActiveAuctions(prevAuctions => 
        prevAuctions.filter(auction => auction.id !== auctionId)
      );
      setPastAuctions(prevAuctions => 
        prevAuctions.filter(auction => auction.id !== auctionId)
      );

      // Update total auctions count in stats
      setSellerStats(prevStats => ({
        ...prevStats,
        totalAuctions: prevStats.totalAuctions - 1,
        activeAuctions: prevStats.activeAuctions - 1
      }));

      // Show success message
      alert('Auction deleted successfully');
    } catch (error) {
      console.error('Error deleting auction:', error);
      alert(error.response?.data?.message || 'Failed to delete auction. Please try again later.');
    }
  };

  if (loading) {
    return <div className="container loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <h1>Seller Dashboard</h1>
        <Link to="/create-auction" className="btn btn-primary">
          + Create New Auction
        </Link>
      </div>
      <div className="container">
        <div className="user-stats-grid">
          <div className="stats-card user-info">
            <h3>Profile Info</h3>
            <p><strong>Name:</strong> {sellerStats.name}</p>
            <p><strong>Email:</strong> {sellerStats.email}</p>
          </div>
          <div className="stats-card">
            <h3>Total Auctions</h3>
            <div className="stats-value">{sellerStats.totalAuctions}</div>
          </div>
          <div className="stats-card">
            <h3>Active Auctions</h3>
            <div className="stats-value">{sellerStats.activeAuctions}</div>
          </div>
          <div className="stats-card">
            <h3>Total Earnings</h3>
            <div className="stats-value">{formatINR(sellerStats.totalEarnings)}</div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-tabs">
            <button
              className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active Auctions
            </button>
            <button
              className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Past Auctions
            </button>
          </div>

          <div className="dashboard-table-container">
            {activeTab === 'active' ? (
              <>
                <h2 className="table-title">Your Active Auctions</h2>
                {activeAuctions.length > 0 ? (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Current Bid</th>
                        <th>Bids</th>
                        <th>End Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeAuctions.map((auction) => (
                        <tr key={auction.id}>
                          <td>
                            <div className="item-cell">
                              <div className="item-image">
                                <img 
                                  src={auction.imageData ? 
                                    `data:image/jpeg;base64,${auction.imageData}` : 
                                    'https://via.placeholder.com/300'
                                  } 
                                  alt={auction.title} 
                                />
                              </div>
                              <div className="item-title">
                                <Link to={`/auction/${auction.id}`}>{auction.title}</Link>
                              </div>
                            </div>
                          </td>
                          <td>{formatINR(auction.currentPrice)}</td>
                          <td>{auction.bidCount || 0}</td>
                          <td>{new Date(auction.endTime).toLocaleDateString()}</td>
                          <td>
                            <div className="table-actions">
                              <Link 
                                to={`/auction/${auction.id}`} 
                                className="action-link view"
                              >
                                View
                              </Link>
                              <Link 
                                to={`/edit-auction/${auction.id}`} 
                                className="action-link edit"
                              >
                                Edit
                              </Link>
                              <button 
                                onClick={() => handleDeleteAuction(auction.id)}
                                className="action-link delete"
                                type="button"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-items">You don't have any active auctions.</div>
                )}
              </>
            ) : (
              <>
                <h2 className="table-title">Your Past Auctions</h2>
                {pastAuctions.length > 0 ? (
                  <table className="dashboard-table past-auctions">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Final Price</th>
                        <th>Bids</th>
                        <th>End Date</th>
                        <th>Payment Status</th>
                        <th>Bidder</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastAuctions.map((auction) => (
                        <tr key={auction.id}>
                          <td>
                            <div className="item-cell">
                              <div className="item-image">
                                <img 
                                  src={auction.imageData ? 
                                    `data:image/jpeg;base64,${auction.imageData}` : 
                                    'https://via.placeholder.com/300'
                                  } 
                                  alt={auction.title}
                                />
                              </div>
                              <div className="item-title">
                                <Link to={`/auction/${auction.id}`}>{auction.title}</Link>
                              </div>
                            </div>
                          </td>
                          <td>{auction.finalPrice ? formatINR(auction.finalPrice) : formatINR(auction.currentPrice)}</td>
                          <td>{auction.bidCount || 0}</td>
                          <td>{new Date(auction.endTime).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                          })}</td>
                          <td className="text-center">
                            {auction.bidCount > 0 ? (
                              <span className={`payment-status ${auction.paymentStatus?.toLowerCase() || 'pending'}`}>
                                {auction.paymentStatus || 'PENDING'}
                              </span>
                            ) : (
                              <span className="payment-status unsold">Unsold</span>
                            )}
                          </td>
                          <td>
                            <span className="bidder-name">
                              {auction.buyerName || (auction.bidCount > 0 ? 'Not Sold' : 'No Bids')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-items">You don't have any past auctions.</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

