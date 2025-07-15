import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import './ViewResult.css';

const ViewResult = () => {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [bidHistory, setBidHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const [auctionRes, bidsRes] = await Promise.all([
                    api.getAuctionById(id),
                    api.getAuctionBids(id)
                ]);
                setAuction(auctionRes.data);
                setBidHistory(bidsRes.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load auction results');
                setLoading(false);
            }
        };

        fetchResults();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="auction-result-page">
            <div className="container">
                <h2>Auction Results</h2>
                <div className="result-card">
                    <div className="auction-summary">
                        <h3>{auction.title}</h3>
                        <div className="winning-info">
                            <p>Final Price: ₹{auction.currentPrice.toFixed(2)}</p>
                            <p>Total Bids: {auction.bidCount}</p>
                            <p>Ended: {new Date(auction.endTime).toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <div className="bid-history">
                        <h3>Bid History</h3>
                        <table className="bid-table">
                            <thead>
                                <tr>
                                    <th>Bidder</th>
                                    <th>Amount</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bidHistory.map(bid => (
                                    <tr key={bid.id} className={bid.id === auction.winningBid?.id ? 'winning-bid' : ''}>
                                        <td>{bid.bidderName}</td>
                                        <td>₹{bid.amount.toFixed(2)}</td>
                                        <td>{new Date(bid.bidTime).toLocaleString()}</td>
                                        <td>
                                            {bid.id === auction.winningBid?.id ? 
                                                <span className="badge winner">Winner</span> : 
                                                <span className="badge">Bid</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewResult;
