import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import './Winner.css';

function Winner() {
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWinners = async () => {
            try {
                setLoading(true);
                const response = await api.get('/winners');
                console.log('Fetched winners data:', response.data);
                
                // Only get the winners (closed auctions with highest bids)
                const winnersData = response.data.winners || [];
                
                // Filter to ensure we only show products that have bids and are closed
                const validWinners = winnersData.filter(winner => 
                    winner.winningBid && 
                    winner.winnerName && 
                    winner.status === 'CLOSED'
                );
                
                setWinners(validWinners);
            } catch (err) {
                console.error('Error fetching winners:', err);
                setError(err.response?.data?.message || 'Failed to load winners');
            } finally {
                setLoading(false);
            }
        };

        fetchWinners();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading winners...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button onClick={() => navigate('/home')} className="home-button">
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="winner-page">
            <div className="winner-header">
                <h1>🏁 Auction Winners</h1>
                <p>View all completed auctions and their highest bidders</p>
            </div>

            {/* Winners Section */}
            {winners.length > 0 ? (
                <div className="winners-section">
                    <h2>🏆 Winners ({winners.length})</h2>
                    <p className="winners-description">
                        Showing winners with the highest bid amounts for completed auctions
                    </p>
                    <div className="winners-grid">
                        {winners.map((winner, index) => (
                            <div className="winner-card" key={winner.productId}>
                                <div className="winner-badge">
                                    🏆 Winner #{index + 1}
                                </div>

                                {winner.productImage && (
                                    <div className="product-image-container">
                                        <img
                                            src={winner.productImage}
                                            alt={winner.productName}
                                            className="product-image"
                                        />
                                    </div>
                                )}

                                <div className="product-details">
                                    <h3 className="product-name">{winner.productName}</h3>
                                    <p className="product-category"><strong>Category:</strong> {winner.productCategory}</p>
                                    <p className="starting-price"><strong>Starting Price:</strong> {formatPrice(winner.startingPrice)}</p>
                                    <p className="total-bids"><strong>Total Bids:</strong> {winner.totalBids}</p>
                                </div>

                                <div className="winner-details">
                                    <div className="winner-info">
                                        <h4>🎉 Winner Details</h4>
                                        <p><strong>Name:</strong> {winner.winnerName}</p>
                                        <p><strong>Email:</strong> {winner.winnerEmail}</p>
                                    </div>

                                    <div className="winning-bid">
                                        <h4>🏆 Highest Bid</h4>
                                        <p className="bid-amount">{formatPrice(winner.winningBid)}</p>
                                        <p className="bid-date">Bid placed on {formatDate(winner.bidDate)}</p>
                                    </div>
                                </div>

                                <div className="auction-details">
                                    <p><strong>Auction Ended:</strong> {formatDate(winner.auctionEndDate)} at {formatTime(winner.auctionEndTime)}</p>
                                    <p className="profit"><strong>Profit:</strong> {formatPrice(winner.winningBid - winner.startingPrice)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="no-winners">
                    <h2>No Winners Yet</h2>
                    <p>No completed auctions with bids found. Check back later for winners!</p>
                    <button onClick={() => navigate('/home')} className="browse-button">
                        Browse Auctions
                    </button>
                </div>
            )}

            <button onClick={() => navigate('/home')} className="home-button">
                Back to Home
            </button>
        </div>
    );
}

export default Winner;
