import React from 'react';
import './AboutUs.css'; // Assuming you add styles in a separate CSS file

function Aboutus() {
  return (
    <div className="about-us">
      <header className="about-header">
        <h1>Welcome to BidSphere</h1>
        <p>Your trusted online auction platform for buying and selling with ease.</p>
      </header>

      <section className="about-content">
        <div className="info">
          <h2>About BidSphere</h2>
          <p>BidSphere is a dynamic and innovative platform that brings buyers and sellers together through seamless online auctions. Whether you're looking to buy a rare item or auction off something valuable, we're here to help make your experience smooth, secure, and exciting.</p>
          <p>Founded in 2025, our mission is to provide a user-friendly space for all types of online auctions—no matter how big or small. We offer real-time bidding, instant notifications, and a hassle-free experience for both sellers and buyers.</p>
          
          <h3>Our Mission</h3>
          <p>To democratize the auction experience by providing a secure, transparent, and accessible platform that connects passionate collectors, savvy buyers, and motivated sellers worldwide.</p>
          
          <h3>Our Vision</h3>
          <p>To become the leading online auction platform, known for innovation, trust, and exceptional user experience in the digital marketplace.</p>
        </div>

        <div className="images">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ8nNat64xVCo2IyeOX2nRsJcXHRmQ-WNflA&s"  className="about-img"/>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7kauiuYpt2hRarm9NfQhfCvWaYjP55vYtng&s"  className="about-img"/>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose BidSphere?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔒 Secure & Trusted</h3>
            <p>Advanced security measures and verified user authentication ensure safe transactions for all participants.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Real-Time Bidding</h3>
            <p>Experience the thrill of live auctions with instant bid updates and real-time notifications.</p>
          </div>
          <div className="feature-card">
            <h3>📱 User-Friendly Interface</h3>
            <p>Intuitive design makes bidding and selling accessible to users of all technical levels.</p>
          </div>
          <div className="feature-card">
            <h3>🌍 Global Reach</h3>
            <p>Connect with buyers and sellers worldwide, expanding your market reach exponentially.</p>
          </div>
          <div className="feature-card">
            <h3>💎 Diverse Categories</h3>
            <p>From antiques to electronics, art to collectibles - find or sell items across all categories.</p>
          </div>
          <div className="feature-card">
            <h3>📊 Transparent Process</h3>
            <p>Complete transparency in bidding history, seller ratings, and auction outcomes.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up for free and complete your profile with verification for enhanced security.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Browse or List</h3>
            <p>Explore active auctions or list your items with detailed descriptions and photos.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Bid or Monitor</h3>
            <p>Place bids on items you want or monitor your listings for incoming bids.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Win & Complete</h3>
            <p>Winning bidders complete secure transactions with our protected payment system.</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <h2>BidSphere by the Numbers</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>10,000+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-card">
            <h3>50,000+</h3>
            <p>Successful Auctions</p>
          </div>
          <div className="stat-card">
            <h3>₹100M+</h3>
            <p>Total Value Traded</p>
          </div>
          <div className="stat-card">
            <h3>99.8%</h3>
            <p>User Satisfaction</p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2>Our Team</h2>
        <p>BidSphere is powered by a dedicated team of professionals committed to revolutionizing the online auction experience. Our diverse team brings together expertise in technology, e-commerce, security, and user experience design.</p>
        
        <div className="team-grid">
          <div className="team-member">
            <h3>Technology Team</h3>
            <p>Expert developers and engineers ensuring platform reliability and innovation.</p>
          </div>
          <div className="team-member">
            <h3>Customer Support</h3>
            <p>24/7 support team ready to assist with any questions or concerns.</p>
          </div>
          <div className="team-member">
            <h3>Security Team</h3>
            <p>Cybersecurity experts maintaining the highest standards of data protection.</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>For inquiries or support, feel free to reach out to us:</p>
        
        <div className="contact-grid">
          <div className="contact-info">
            <h3>📞 Phone Support</h3>
            <p><strong>Main Line:</strong>+91 9390000000</p>
            <p><strong>Technical Support:</strong>+91 9390000000 </p>
            <p><strong>Hours:</strong> 24/7 Available</p>
          </div>
          
          <div className="contact-info">
            <h3>📧 Email Support</h3>
            <p><strong>General Inquiries:</strong> info@bidsphere.com</p>
            <p><strong>Technical Support:</strong> support@bidsphere.com</p>
            <p><strong>Business Partnerships:</strong> partnerships@bidsphere.com</p>
          </div>
          
          <div className="contact-info">
            <h3>📍 Office Location</h3>
            <p><strong>Address:</strong> Nehru Nagar,Dubbak,Siddipet</p>
            <p>Tech District, Bangalore 560001</p>
            <p>Karnataka, India</p>
          </div>
        </div>
        
        <div className="social-links">
          <h3>Follow Us</h3>
          <p>Stay updated with the latest news and auction highlights:</p>
          
        </div>
      </section>
    </div>
  );
}

export default Aboutus;
