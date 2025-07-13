import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewBids.css';

const ViewBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/bids', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Fetched bids:', response.data);
        setBids(response.data);
      } catch (err) {
        console.error('Error fetching bids:', err);
        setError(err.response?.data?.message || 'Failed to load bids');
        if (err.response?.status === 401) {
          navigate('/signin');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
        <p>Loading bids...</p>
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
    <div className="view-bids-container">
      <div className="bids-header">
        <h1>📋 All Bids</h1>
        <p>Complete list of all placed bids</p>
      </div>
      
      {bids.length > 0 ? (
        <div className="bids-section">
          <div className="bids-summary">
            <h2>Total Bids: {bids.length}</h2>
          </div>
          
          <div className="bids-list">
            {bids.map((bid, index) => (
              <div className="bid-item" key={bid._id}>
                <div className="bid-number">
                  #{index + 1}
                </div>
                
                {/* Product Image */}
                <div className="product-image-container">
                  {bid.productId?.img ? (
                    <img
                      src={bid.productId.img}
                      alt={bid.productId.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="no-image">
                      <span>📦</span>
                    </div>
                  )}
                </div>
                
                <div className="bid-info">
                  <div className="product-info">
                    <h3>{bid.productId?.name || 'Product Not Found'}</h3>
                    <p className="category">{bid.productId?.category || 'N/A'}</p>
                  </div>
                  
                  <div className="bidder-info">
                    <p><strong>Bidder:</strong> {bid.bidder?.name || 'Anonymous'}</p>
                    <p><strong>Email:</strong> {bid.bidder?.email || 'N/A'}</p>
                  </div>
                  
                  <div className="bid-details">
                    <p><strong>Bid Amount:</strong> {formatPrice(bid.bidAmount)}</p>
                    <p><strong>Date:</strong> {formatDate(bid.timestamp)}</p>
                  </div>
                </div>
                
                {/* Only show status for highest bid */}
                {bid.bidAmount === bid.productId?.price && (
                  <div className="bid-status">
                    <span className="status-highest">🏆 Highest</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-bids">
          <h2>No Bids Placed Yet</h2>
          <p>Start bidding on items to see your bids here!</p>
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
};

export default ViewBids;
