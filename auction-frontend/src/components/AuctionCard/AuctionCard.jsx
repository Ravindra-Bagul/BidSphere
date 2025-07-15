import React from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../CountdownTimer/CountdownTimer';
import './AuctionCard.css';

const AuctionCard = ({ auction }) => {
    const now = new Date();
    const startTime = new Date(auction.startTime);
    const endTime = new Date(auction.endTime);

    const getAuctionStatus = () => {
        if (now < startTime) return 'upcoming';
        if (now >= startTime && now < endTime) return 'active';
        return 'ended';
    };

    const getImageUrl = () => {
        return auction.imageData 
            ? `data:image/jpeg;base64,${auction.imageData}`
            : 'https://via.placeholder.com/300';
    };

    const status = getAuctionStatus();

    return (
        <div className="auction-card">
            <span className={`status-badge ${status}`}>
                {status === 'upcoming' ? 'Upcoming' : 
                 status === 'active' ? 'Active' : 'Ended'}
            </span>
            
            <Link to={`/auction/${auction.id}`}>
                <div className="auction-image">
                    <img src={getImageUrl()} alt={auction.title} />
                </div>
                <div className="auction-details">
                    <h3 className="auction-title">{auction.title}</h3>
                    <div className="auction-price">
                        <span className='price1'>Current Bid:</span>
                        <strong className='price1'>  ₹{auction.currentPrice?.toFixed(2) || auction.startingPrice?.toFixed(2)}</strong>
                    </div>
                    <div className="auction-countdown">
                        {status === 'upcoming' ? (
                            <>
                                <span className="labell">Auction Starts in:</span>
                                <CountdownTimer endTime={startTime} />
                            </>
                        ) : status === 'active' ? (
                            <>
                                <span className="labell" >Auction Ends in:</span>
                                <CountdownTimer endTime={endTime} />
                            </>
                        ) : (
                            <span className="ended-text">Auction Ended</span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default AuctionCard;
