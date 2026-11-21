import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

function Sign_in() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      console.log('Sending signin request:', { email });
      
      const response = await api.post(
        '/signin',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('Signin response:', response.data);

      if (response.data.message === 'Signin successful') {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        setMessage('Signin successful!');
        setTimeout(() => navigate('/home'), 1000); // Add delay for better UX
      } else {
        setMessage(response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 500) {
        setMessage('Server error. Please try again later.');
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.code === 'ECONNREFUSED') {
        setMessage('Cannot connect to server. Please check if the backend is running.');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-in-cls">
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          required
        /><br />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          required
        /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Sign_in;
