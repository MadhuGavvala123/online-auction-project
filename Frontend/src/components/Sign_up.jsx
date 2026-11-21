import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Sign_up.css'; 

function Sign_up() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'mobile') setMobile(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!name || !mobile || !email || !password) {
      setMessage('All fields are required!');
      return;
    }

    try {
      setLoading(true);
      console.log('Sending signup request:', { name, mobile, email });
      
      const res = await axios.post('/signup', {
        name,
        mobile,
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Signup response:', res.data);

      if (res.data.message === 'Signup successful') {
        setMessage('Signup successful! Redirecting to sign in...');
        setTimeout(() => navigate('/signin'), 2000);
      } else {
        setMessage(res.data.message || 'Signup failed');
      }

      setName('');
      setMobile('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Signup error:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 500) {
        setMessage('Server error. Please try again later.');
      } else if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else if (err.code === 'ECONNREFUSED') {
        setMessage('Cannot connect to server. Please check if the backend is running.');
      } else {
        setMessage('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-up-cls">
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={name} onChange={handleChange} required />
        <br />

        <label>Mobile Number:</label>
        <input type="text" name="mobile" value={mobile} onChange={handleChange} required />
        <br />

        <label>Email:</label>
        <input type="email" name="email" value={email} onChange={handleChange} required />
        <br />

        <label>Password:</label>
        <input type="password" name="password" value={password} onChange={handleChange} required />
        <br />

        <button type="submit" className="btn btn-outline-dark" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Sign_up;
