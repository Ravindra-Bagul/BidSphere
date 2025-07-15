import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './AuctionDetailsPage.css';
import CountdownTimer from '../../components/CountdownTimer/CountdownTimer';
import api from '../../services/api';

const AuctionDetailsPage = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock user state
  const [bidHistory, setBidHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Mock minimum bid increment
  const minBidIncrement = 5;
  const POLLING_INTERVAL = 5000;

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setLoggedInUser(JSON.parse(userInfo));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [auctionResponse, bidsResponse] = await Promise.all([
          api.getAuctionById(id),
          api.getAuctionBids(id)
        ]);

        setAuction(auctionResponse.data);
        setBidHistory(bidsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching auction details:', error);
        setError('Failed to load auction details');
        setLoading(false);
      }
    };

    fetchData(); // Initial fetch
    // Set up polling for real-time updates
    const pollInterval = setInterval(fetchData, POLLING_INTERVAL);
    // Cleanup polling on component unmount
    return () => clearInterval(pollInterval);
  }, [id]);

  const handleBidAmountChange = (e) => {
    setBidAmount(e.target.value);
  };
  const isLastBidder = () => {
    if (bidHistory.length === 0) return false;
    const lastBid = bidHistory[0]; // Assuming bids are sorted by time desc
    return lastBid.bidderId === loggedInUser?.id;
  };
  const handlePlaceBid = async (e) => {
    e.preventDefault();

    if (!loggedInUser) {
      alert('Please login to place bid');
      return;
    }

    if (loggedInUser.userType !== 'BIDDER') {
      alert('Only bidders can place bids');
      return;
    }

    if (isLastBidder()) {
      alert('You cannot place consecutive bids. Please wait for other bidders.');
      return;
    }

    try {
      const bid = {
        auctionId: auction.id,
        bidderId: loggedInUser.id,
        amount: parseFloat(bidAmount)
      };

      await api.placeBid(bid);

      // Refresh auction data
      const [auctionResponse, bidsResponse] = await Promise.all([
        api.getAuctionById(id),
        api.getAuctionBids(id)
      ]);

      setAuction(auctionResponse.data);
      setBidHistory(bidsResponse.data);
      setBidAmount('');

      // Show success message
      alert('Bid placed successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to place bid';
      alert(errorMessage);
      console.error('Bid error:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderBidSection = () => {
    const now = new Date();
    const startTime = new Date(auction.startTime);
    const endTime = new Date(auction.endTime);

    if (loggedInUser?.userType === 'SELLER') {
      return (
          <div className="auction-status">
              <div className="countdown-section">
                  <span className="countdown-label">
                      {now < startTime ? 'Starts in:' : 'Time remaining:'}
                  </span>
                  <CountdownTimer endTime={now < startTime ? startTime : endTime} />
              </div>
          </div>
      );
  }

    if (now < startTime) {
      return (
        <div className="bid-not-started">
          <p>Bidding starts on {startTime.toLocaleString()}</p>
          <div className="countdown-section">
            <span className="countdown-label">Starts in:</span>
            <CountdownTimer endTime={startTime} />
          </div>
        </div>
      );
    }

    if (now > endTime) {
      return (
        <div className="auction-ended">
          <p>This auction has ended</p>
          <p className="end-time">Ended on {endTime.toLocaleString()}</p>
        </div>
      );
    }

    return (
      <div className="bid-section">
        <div className="countdown-section">
          <span className="countdown-label">Auction Ends in:</span>
          <CountdownTimer endTime={endTime} />
        </div>
      <div className="bid-form">
        <div className="place-bid-section">
          <form onSubmit={handlePlaceBid}>
            <div className="form-group">
              <label htmlFor="bidAmount">Your Bid (₹)</label>
              <div className="bid-input-group">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  id="bidAmount"
                  value={bidAmount}
                  onChange={handleBidAmountChange}
                  min={auction.currentPrice + minBidIncrement}
                  //step="5"
                  className="form-control"
                  required
                />
              </div>
              <small className="min-bid-info">
                Minimum bid: ₹{(auction.currentPrice + minBidIncrement).toFixed(2)}
              </small>
            </div>
            <button type="submit" className="btn btn-primary bid-button">
              Place Bid
            </button>
          </form>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="container loading">Loading auction details...</div>;
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  if (!auction) {
    return <div className="container error">Auction not found</div>;
  }

  return (
    <div className="auction-details-page">
      <div className="container">
        <div className="auction-details-content">
          <div className="auction-details-left">
            <div className="auction-image-gallery">
              <img 
                src={auction.imageData ? 
                  `data:image/jpeg;base64,${auction.imageData}` : 
                  'https://via.placeholder.com/300'
                } 
                alt={auction.title} 
                className="main-image"
              />
              {auction.additionalImages && (
                <div className="thumbnail-images">
                  {auction.additionalImages.map((img, index) => (
                    <div key={index} className="thumbnail">
                      <img src={img} alt={`${auction.title} ${index + 2}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="auction-description">
              <h3>Description</h3>
              <p>{auction.description || 'No description provided for this item.'}</p>
            </div>

            <div className="auction-details-section">
              <h3>Item Details</h3>
              <table className="details-table">
                <tbody>
                  <tr>
                    <td>Category:</td>
                    <td>{auction.category || 'Uncategorized'}</td>
                  </tr>
                  <tr>
                    <td>Seller:</td>
                    <td>
                      <Link to={`/seller/${auction.sellerId}`}>{auction.sellerName}</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="auction-details-right">
            <div className="auction-status-card">
              <h2 className="auction-title">{auction.title}</h2>

              {auction.auctionType === 'live' && auction.isLive && (
                <div className="live-status">
                  <span className="live-indicator"></span> LIVE NOW
                </div>
              )}

              <div className="auction-timer-section">
                {renderBidSection()}
              </div>

              <div className="auction-price-section">
                <div className="current-bid">
                  <span>Current Bid:</span>
                  <span className="price">₹{auction.currentPrice.toFixed(2)}</span>
                </div>
                <div className="bid-count">
                  <span>{auction.bids} bids</span>
                </div>
              </div>

              <div className="auction-result">
                <div className="winning-bid">
                  <span>Final Price:</span>
                  <span className="price">₹{auction.currentPrice.toFixed(2)}</span>
                </div>
                <div className="winner-info">
                  <span className="winner-label">Winner:</span>
                  <span className="winner-name">{auction.buyerName || 'No Winner'}</span>
                </div>
              </div>
            </div>

            <div className="bid-history-section">
              <h3>Bid History</h3>
              {bidHistory.length > 0 ? (
                <div className="bid-history-list">
                  {bidHistory.map((bid) => (
                    <div key={bid.id} className="bid-history-item">
                      <div className="bid-user">
                        <span className="username">{bid.bidderName || 'Anonymous'}</span>
                        <span className="bid-time">
                          {formatDate(bid.bidTime)}
                        </span>
                      </div>
                      <div className="bid-amount">₹{bid.amount?.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                      })}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-bids">No bids have been placed yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AuctionDetailsPage;
