import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/background.png';

function Landing() {
  const navigate = useNavigate();

  const buttonStyle = {
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease, transform 0.2s ease-in-out',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textTransform: 'uppercase',
    //whiteSpace: 'nowrap',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
       backgroundRepeat: 'no-repeat',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{
        background: 'rgba(253, 220, 220, 0.85)',
        borderRadius: '24px',
        padding: '48px 32px',
        boxShadow: '0 8px 32px rgba(240, 169, 193, 0.15)',
        textAlign: 'center',
        maxWidth: '450px',
        width: '100%',
        zIndex: 1,
      }}>
        <h1 style={{ marginBottom: '30px', fontSize: '3rem', color: 'black' }}>Buy & Sell</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', maxWidth: '80%', color: 'black', marginLeft: 'auto', marginRight: 'auto' }}>
          Welcome to the ultimate online auction platform. Sign up to start selling or find the perfect deal!
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/signin')}
            style={buttonStyle}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            style={buttonStyle}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
