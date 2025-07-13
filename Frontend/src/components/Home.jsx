import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';
import Notification from './Notification';
import './Home.css';

// Countdown Timer Component
const CountdownTimer = ({ endTime, isLive }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const end = new Date(endTime).getTime();
            const difference = end - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
                setIsExpired(false);
            } else {
                setIsExpired(true);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    if (isExpired) {
        return <div className="countdown-expired">Auction Ended</div>;
    }

    return (
        <div className="countdown-timer">
            <div className="countdown-label">{isLive ? 'Time Left:' : 'Starts In:'}</div>
            <div className="countdown-display">
                {timeLeft.days > 0 && <span className="countdown-unit">{timeLeft.days}d </span>}
                <span className="countdown-unit">{String(timeLeft.hours).padStart(2, '0')}:</span>
                <span className="countdown-unit">{String(timeLeft.minutes).padStart(2, '0')}:</span>
                <span className="countdown-unit">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
        </div>
    );
};

const Home = () => {
    const { products, loading, error, deleteProduct, fetchProducts } = useProductContext();
    const [newlyAddedItem, setNewlyAddedItem] = useState(null);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if user is logged in and get user info
        const userInfo = localStorage.getItem('user');
        if (userInfo) {
            const userData = JSON.parse(userInfo);
            setUser(userData);
            setIsAdmin(userData.isAdmin || userData.email === 'admin@auction.com');
        }

        // If we're coming from selling an item, refresh the product list
        if (location.state?.refreshTime) {
            fetchProducts(); // ✅ Refresh product list
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [navigate, location.state, location.pathname, fetchProducts]);

    const categorizeAuctions = (products) => {
        const now = new Date();
        const live = [];
        const upcoming = [];
        const closed = [];

        const allProducts = newlyAddedItem ? [...products, newlyAddedItem] : products;

        allProducts.forEach((product) => {
            try {
                const startTimeString = `${product.auctionDate}T${product.auctionStartTime}:00`;
                const endTimeString = `${product.auctionEndDate || product.auctionDate}T${product.auctionEndTime}:00`;
                
                const start = new Date(startTimeString);
                const end = new Date(endTimeString);

                if (now >= start && now <= end) {
                    live.push(product);
                } else if (now < start) {
                    upcoming.push(product);
                } else if (now > end) {
                    closed.push(product);
                }
            } catch (error) {
                console.error("Error parsing date/time for product:", product.name, error);
            }
        });

        return { live, upcoming, closed };
    };

    const { live, upcoming, closed } = categorizeAuctions(products);

    const handleBid = (productId) => {
        if (!user) {
            alert('Please login to place a bid');
            navigate('/signin');
            return;
        }
        
        // Navigate to the product details page
        navigate(`/buy/${productId}`);
    };

    const handleDelete = async (productName) => {
        if (!isAdmin) {
            setNotification({
                message: 'Only admin can delete items',
                type: 'error'
            });
            return;
        }

        if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
            const result = await deleteProduct(productName);
            setNotification({
                message: result.message,
                type: result.success ? 'success' : 'error'
            });
        }
    };

    const renderAuctionSection = (title, items, isLive = false) => (
        <div className="auction-section">
            <h2>{title}</h2>
            {items.length > 0 ? (
                <div className="auction-grid">
                    {items.map(product => {
                        // Debug: Log the product data to see what fields are available
                        console.log('Product data:', product);
                        
                        // Use auctionEndDate if it exists, otherwise fallback to auctionDate
                        const endDate = product.auctionEndDate || product.auctionDate;
                        const endTimeString = `${endDate}T${product.auctionEndTime}:00`;
                        const startTimeString = `${product.auctionDate}T${product.auctionStartTime}:00`;
                        const countdownTime = isLive ? endTimeString : startTimeString;
                        
                        return (
                            <div key={product._id} className="auction-card">
                                <div className="auction-image-container">
                                    {product.img && (
                                        <img 
                                            src={product.img} 
                                            alt={product.name} 
                                            className="auction-image"
                                        />
                                    )}
                                    <CountdownTimer 
                                        endTime={countdownTime} 
                                        isLive={isLive}
                                    />
                                </div>
                                <div className="auction-details">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="price">Price: ₹{product.price}</p>
                                    <p className="category">Category: {product.category}</p>
                                    <div className="auction-dates">
                                        <p className="start-date">
                                            <strong>Starts:</strong> {product.auctionDate} at {product.auctionStartTime}
                                        </p>
                                        <p className="end-date">
                                            <strong>Ends:</strong> {endDate} at {product.auctionEndTime}
                                        </p>
                                    </div>
                                    <div className="auction-actions">
                                        {isLive && (
                                            <button 
                                                onClick={() => handleBid(product._id)}
                                                className="bid-button"
                                            >
                                                Place a Bid
                                            </button>
                                        )}
                                        {isAdmin && (
                                            <button 
                                                onClick={() => handleDelete(product.name)}
                                                className="delete-button"
                                                style={{ backgroundColor: 'red', color: 'white' }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="no-auctions">No {title.toLowerCase()} at the moment.</p>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading auctions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button onClick={() => window.location.reload()} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            
            <div className="home-container">
                <h1 className="page-title">Available Auctions</h1>
                
                {user && (
                    <div className="user-info">
                        <p>Welcome, <span className="user-name">{user.name}</span>!</p>
                        {isAdmin && <p className="admin-badge">Admin</p>}
                    </div>
                )}
                
                {renderAuctionSection("Live Auctions", live, true)}
                {renderAuctionSection("Upcoming Auctions", upcoming)}
                {renderAuctionSection("Closed Auctions", closed)}
            </div>
        </>
    );
};

export default Home;