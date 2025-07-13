import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Sell.css';

function Sell() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        auctionDate: '',
        auctionEndDate: '',
        auctionStartTime: '',
        auctionEndTime: '',
        category: 'Clothing',
        img: null
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    img: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage('Please login to sell items');
                navigate('/signin');
                return;
            }

            const response = await axios.post('http://localhost:5001/sell', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setSuccessMessage("✅ Item listed successfully!");
                navigate('/home', { 
                    state: { 
                        newlyAddedItem: response.data.product,
                        refreshTime: Date.now()
                    } 
                });
            }
        } catch (error) {
            console.error("Submission error:", error);
            const errorMsg = error.response?.data?.message || 
                            error.message || 
                            'Failed to list item. Please try again.';
            setErrorMessage(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="sell-form-container">
            <h2>List New Item for Auction</h2>
            <form onSubmit={handleSubmit} className="sell-form">
                <label>Product Name</label>
                <input 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                />

                <label>Description</label>
                <textarea 
                    name="description"
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                />

                <label>Starting Price (₹)</label>
                <input 
                    type="number" 
                    name="price"
                    min="1"
                    value={formData.price} 
                    onChange={handleChange} 
                    required 
                />

                <div className="date-inputs">
                    <div>
                        <label>Start Date</label>
                        <input 
                            type="date" 
                            name="auctionDate"
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.auctionDate} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label>End Date</label>
                        <input 
                            type="date" 
                            name="auctionEndDate"
                            min={formData.auctionDate || new Date().toISOString().split('T')[0]}
                            value={formData.auctionEndDate} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>

                <div className="time-inputs">
                    <div>
                        <label>Start Time</label>
                        <input 
                            type="time" 
                            name="auctionStartTime"
                            value={formData.auctionStartTime} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label>End Time</label>
                        <input 
                            type="time" 
                            name="auctionEndTime"
                            value={formData.auctionEndTime} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>

                <label>Category</label>
                <select 
                    name="category"
                    value={formData.category} 
                    onChange={handleChange}
                >
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Automobile">Automobile</option>
                    <option value="Jewellery">Jewellery</option>
                    <option value="Home">Home</option>
                    <option value="Others">Others</option>
                </select>

                <label>Product Image</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    required 
                />

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Listing...' : 'Sell Item'}
                </button>

                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
}

export default Sell;