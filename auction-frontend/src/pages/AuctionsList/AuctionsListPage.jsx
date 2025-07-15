import React, { useState, useEffect } from 'react';
import AuctionCard from '../../components/AuctionCard/AuctionCard';
import './AuctionsListPage.css';
import api from '../../services/api';

const AuctionsListPage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('endTime');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await api.getActiveAuctions();
                setAuctions(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching auctions:', error);
                setError('Failed to load auctions');
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    const filterAuctions = (auctions) => {
        const now = new Date();
        
        switch (filter) {
            case 'upcoming':
                return auctions.filter(auction => {
                    const startTime = new Date(auction.startTime);
                    return now < startTime && auction.status === 'ACTIVE';
                });
            case 'active':
                return auctions.filter(auction => {
                    const startTime = new Date(auction.startTime);
                    const endTime = new Date(auction.endTime);
                    return now >= startTime && now < endTime && auction.status === 'ACTIVE';
                });
            case 'ending-soon':
                return auctions.filter(auction => {
                    const startTime = new Date(auction.startTime);
                    const endTime = new Date(auction.endTime);
                    const timeLeft = endTime - now;
                    return now >= startTime && timeLeft > 0 && timeLeft < 24 * 60 * 60 * 1000;
                });
            case 'ended':
                return auctions.filter(auction => 
                    auction.status === 'ENDED' || new Date(auction.endTime) <= now
                );
            default:
                return auctions;
        }
    };

    const sortAuctions = (auctions) => {
        switch (sort) {
            case 'price-asc':
                return [...auctions].sort((a, b) => a.currentPrice - b.currentPrice);
            case 'price-desc':
                return [...auctions].sort((a, b) => b.currentPrice - a.currentPrice);
            case 'endTime':
                return [...auctions].sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
            default:
                return auctions;
        }
    };

    const filteredAndSortedAuctions = sortAuctions(filterAuctions(auctions));

    if (loading) return <div className="loading">Loading auctions...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="auctions-list-page">
            <div className="container">
                <div className="auctions-header">
                    <h1>Browse Auctions</h1>
                    <div className="filters">
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Auctions</option>
                            <option value="upcoming">Upcoming Auctions</option>
                            <option value="active">Active Auctions</option>
                            <option value="ending-soon">Ending Soon</option>
                            
                        </select>
                        <select 
                            value={sort} 
                            onChange={(e) => setSort(e.target.value)}
                            className="sort-select"
                        >
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {filteredAndSortedAuctions.length > 0 ? (
                    <div className="auctions-grid">
                        {filteredAndSortedAuctions.map(auction => (
                            <AuctionCard key={auction.id} auction={auction} />
                        ))}
                    </div>
                ) : (
                    <div className="no-auctions">
                        <p>No auctions found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuctionsListPage;
