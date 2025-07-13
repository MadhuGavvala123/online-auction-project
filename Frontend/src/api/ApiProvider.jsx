// src/api/ApiProvider.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const ApiProvider = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Response interceptor
    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          navigate('/signin');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return children;
};

export default ApiProvider;