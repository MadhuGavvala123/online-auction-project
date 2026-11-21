import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import './Buy.css';

const Buy = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get(`/items/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Failed to load product details.');
            }
        };

        fetchProduct();
    }, [productId]);

    const handleBid = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (!bidAmount) {
            setError('Please enter a bid amount.');
            setLoading(false);
            return;
        }

        const bid = parseFloat(bidAmount);

        if (isNaN(bid) || bid <= 0) {
            setError('Please enter a valid bid amount.');
            setLoading(false);
            return;
        }

        if (!product) {
            setError('Product details not loaded.');
            setLoading(false);
            return;
        }

        const currentPrice = Number(product.currentPrice ?? product.price);
        if (bid <= currentPrice) {
            setError(`Your bid must be higher than the current price of ₹${currentPrice}`);
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('You need to be logged in to place a bid');
                navigate('/signin');
                return;
            }

            const response = await api.post(
                `/bid/${productId}`,
                { bidAmount: bid },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                setSuccessMessage('Your bid has been placed successfully!');
                setProduct({
                    ...product,
                    currentPrice: response.data.currentPrice ?? bid
                });
                
                setTimeout(() => navigate('/home'), 2000);
            }
        } catch (error) {
            console.error('Error placing bid:', error);
            
            if (error.response) {
                if (error.response.status === 401) {
                    setError('Session expired. Please login again.');
                    navigate('/signin');
                } else if (error.response.status === 400) {
                    setError(error.response.data.message || 'Invalid bid request');
                } else {
                    setError(error.response.data.message || 'Failed to place bid');
                }
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
  
    if (!product) {
        return (
            <div className="loading">
                {error || 'Loading product details...'}
            </div>
        );
    }

    const currentPrice = Number(product.currentPrice ?? product.price);
    const start = new Date(`${product.auctionDate}T${product.auctionStartTime}:00+05:30`);
    const end = new Date(`${(product.auctionEndDate || product.auctionDate)}T${product.auctionEndTime}:00+05:30`);
    const now = new Date();
    const isLive = now >= start && now <= end;

    return (
        <div className="buy-container">
            <h1>Product Details</h1>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <div className="product-details">
                <h3>{product.name}</h3>
                <p><strong>Starting Price:</strong> ₹{product.price}</p>
                <p><strong>Current Price:</strong> ₹{currentPrice}</p>
                <p><strong>Status:</strong> {isLive ? 'Live' : now < start ? 'Upcoming' : 'Closed'}</p>
                <p><strong>Description:</strong> {product.description}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Auction Date:</strong> {product.auctionDate}</p>
                <p><strong>Start Time:</strong> {product.auctionStartTime}</p>
                <p><strong>End Time:</strong> {product.auctionEndTime}</p>
                {product.img && (
                    <img 
                        src={product.img} 
                        alt={product.name} 
                        className="product-image"
                        style={{
                            width: '250px',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #A78BFA',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                    />
                )}
            </div>

            {isLive ? (
            <form onSubmit={handleBid} className="bid-form">
                <div className="form-group">
                    <label htmlFor="bidAmount">Your Bid (₹):</label>
                    <input
                        type="number"
                        id="bidAmount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={currentPrice + 1}
                        step="0.01"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Placing Bid...' : 'Place Your Bid'}
                </button>
            </form>
            ) : (
                <p className="error-message">
                    {now < start ? 'This auction has not started yet.' : 'This auction is closed.'}
                </p>
            )}
            
            <button onClick={() => navigate('/home')} className="cancel-button">
                Back to Home
            </button>
        </div>
    );
};

export default Buy;