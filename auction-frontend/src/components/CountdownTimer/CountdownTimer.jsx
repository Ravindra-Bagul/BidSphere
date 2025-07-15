import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(endTime) - new Date();
        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    return (
        <div className="countdown-timer">
            <div className="timer-unit">
                <span className="number">{timeLeft.days}</span>
                <span className="label">days</span>
            </div>
            <div className="timer-unit">
                <span className="number">{timeLeft.hours}</span>
                <span className="label">hours</span>
            </div>
            <div className="timer-unit">
                <span className="number">{timeLeft.minutes}</span>
                <span className="label">minutes</span>
            </div>
            <div className="timer-unit">
                <span className="number">{timeLeft.seconds}</span>
                <span className="label">seconds</span>
            </div>
        </div>
    );
};

export default CountdownTimer;
