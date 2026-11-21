// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';

// function PostAuction() {
//   const location = useLocation();
//   const { selectedProduct, user } = location.state || {}; 

//   const [bidAmount, setBidAmount] = useState('');
//   const [currentBid, setCurrentBid] = useState(selectedProduct?.price || 0);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     if (!selectedProduct) {
//       setMessage("No product selected!");
//     }
//   }, [selectedProduct]);

//   const handleBidSubmit = async (e) => {
//     e.preventDefault();

//     if (!bidAmount || bidAmount <= currentBid) {
//       setMessage("Bid amount must be higher than the current bid!");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:5000/submit-bid", {
//         productName: selectedProduct.name,
//         userName: user?.name || "Anonymous",
//         mobile: user?.mobile || "N/A",
//         bidAmount,
//       });

//       setCurrentBid(bidAmount);
//       setMessage(response.data.message || "Bid submitted successfully!");
//     } catch (error) {
//       setMessage("Error submitting bid. Try again!");
//     }
//   };

//   return (
//     <div className="post-auction-container">
//       {selectedProduct ? (
//         <>
//           <h2>Auction for {selectedProduct.name}</h2>
//           <img src={selectedProduct.img} alt={selectedProduct.name} className="product-img" />
//           <p>Minimum Price: {selectedProduct.price}</p>
//           <p>Current Bid: {currentBid}</p>

//           <form onSubmit={handleBidSubmit}>
//             <label>Enter Your Bid:</label>
//             <input
//               type="number"
//               value={bidAmount}
//               onChange={(e) => setBidAmount(e.target.value)}
//               required
//             />
//             <button type="submit">Place Bid</button>
//           </form>

//           {message && <p>{message}</p>}
//         </>
//       ) : (
//         <p>{message || "Loading..."}</p>
//       )}
//     </div>
//   );
// }

// export default PostAuction;









import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import api from '../api/api';

function PostAuction() {
  const location = useLocation();
  const { selectedProduct } = location.state || {}; 

  // Retrieve user from localStorage if not passed via navigation state
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user = location.state?.user || storedUser || { name: "Anonymous", email: "N/A", mobile: "N/A" };

  const [bidAmount, setBidAmount] = useState('');
  const [currentBid, setCurrentBid] = useState(selectedProduct?.price || 0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!selectedProduct) {
      setMessage("No product selected!");
    }
  }, [selectedProduct]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    
    const bidValue = Number(bidAmount);
    if (!bidValue || bidValue <= currentBid) {
      setMessage("Bid amount must be higher than the current bid!");
      return;
    }
  
    try {
      const response = await api.post("/submit-bid", {
        productName: selectedProduct.name,
        userName: user.name,
        email: user.email,
        mobile: user.mobile,
        bidAmount: bidValue,
      });
  
      setCurrentBid(bidValue);
      setMessage(response.data.message || "Bid submitted successfully!");
      setBidAmount('');
  
      // 🔹 Navigate to Dashboard & Pass Product & User Details
      navigate("/dashboard", { state: { selectedProduct, user } });
  
    } catch (error) {
      setMessage("Error submitting bid. Try again!");
    }
  };
  

  return (
    <div className="post-auction-container">
      {selectedProduct ? (
        <>
          <h2>Auction for {selectedProduct.name}</h2>
          <img src={selectedProduct.img} alt={selectedProduct.name} className="product-img" />
          <p><strong>Minimum Price:</strong> {selectedProduct.price}</p>
          <p><strong>Current Bid:</strong> {currentBid}</p>

          <h3>Bidder Details</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>

          <form onSubmit={handleBidSubmit}>
            <label>Enter Your Bid:</label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              required
            />
            <button type="submit">Place Bid</button>
          </form>

          {message && <p>{message}</p>}
        </>
      ) : (
        <p>{message || "Loading..."}</p>
      )}
    </div>
  );
}

export default PostAuction;




















//     

















// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function PostAuction({ onBidPlaced }) {
//   const location = useLocation();
//   const navigate = useNavigate();  // ✅ Move inside the component

//   const { selectedProduct } = location.state || {}; 
//   const storedUser = JSON.parse(localStorage.getItem("user"));
//   const user = location.state?.user || storedUser || { name: "Anonymous", email: "N/A", mobile: "N/A" };

//   const [bidAmount, setBidAmount] = useState('');
//   const [currentBid, setCurrentBid] = useState(selectedProduct?.price || 0);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     if (!selectedProduct) {
//       setMessage("No product selected!");
//     }
//   }, [selectedProduct]);

//   const handleBidSubmit = async (e) => {
//     e.preventDefault();
  
//     const bidValue = Number(bidAmount);
//     if (!bidValue || bidValue <= currentBid) {
//       setMessage("Bid amount must be higher than the current bid!");
//       return;
//     }
  
//     try {
//       const response = await axios.post("http://localhost:3000/submit-bid", {
//         productName: selectedProduct.name,
//         userName: user.name,
//         email: user.email,
//         mobile: user.mobile,
//         bidAmount: bidValue,
//       });

//       setCurrentBid(bidValue);
//       setMessage(response.data.message || "Bid submitted successfully!");
//       setBidAmount('');

//       if (onBidPlaced) {
//         onBidPlaced();  // ✅ Notify Dashboard to update
//       }

//       // ✅ Navigate to Dashboard with product details
//       navigate("/dashboard", { state: { selectedProduct, user, bidAmount: bidValue } });

//     } catch (error) {
//       setMessage("Error submitting bid. Try again!");
//     }
//   };

//   return (
//     <div className="post-auction-container">
//       {selectedProduct ? (
//         <>
//           <h2>Auction for {selectedProduct.name}</h2>
//           <img src={selectedProduct.img} alt={selectedProduct.name} className="product-img" />
//           <p><strong>Minimum Price:</strong> {selectedProduct.price}</p>
//           <p><strong>Current Bid:</strong> {currentBid}</p>

//           <h3>Bidder Details</h3>
//           <p><strong>Name:</strong> {user.name}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Mobile:</strong> {user.mobile}</p>

//           <form onSubmit={handleBidSubmit}>
//             <label>Enter Your Bid:</label>
//             <input
//               type="number"
//               value={bidAmount}
//               onChange={(e) => setBidAmount(e.target.value)}
//               required
//             />
//             <button type="submit">Place Bid</button>
//           </form>

//           {message && <p>{message}</p>}
//         </>
//       ) : (
//         <p>{message || "Loading..."}</p>
//       )}
//     </div>
//   );
// }

// export default PostAuction;
