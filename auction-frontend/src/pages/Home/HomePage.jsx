import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import AuctionCard from '../../components/AuctionCard/AuctionCard';
import HeroBanner from './HeroBanner';
import api from '../../services/api';

const HomePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activeAuctions = await api.getActiveAuctions();
        const now = new Date();
        
        // Include both upcoming and active auctions
        const availableAuctions = activeAuctions.data.filter(auction => 
          new Date(auction.endTime) > now && 
          auction.status === 'ACTIVE'
        ).slice(0, 6);        
        
        setLiveAuctions(availableAuctions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching auctions:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-page">
      <HeroBanner />
      
      <div className="container">
        <section className="auction-section">
          <div className="section-header">
            <h2 className="section-title">Live Auctions</h2>
            <Link to="/auctions?type=live" className="view-all">View All</Link>
          </div>
          <div className="auctions-grid">
            {liveAuctions.map(auction => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </section>
        
        <section className="how-it-works">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Register</h3>
              <p>Create an account as a seller or bidder to get started.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Browse & Bid</h3>
              <p>Find items you're interested in and place your bids.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Win & Pay</h3>
              <p>Win the auction and complete your payment securely.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Receive Item</h3>
              <p>The seller will ship your item and you'll receive it soon!</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
