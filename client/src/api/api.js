import axios from 'axios';

// Create a new axios instance with a base URL
const api = axios.create({
  baseURL: 'https://quizhub-backend-g6ps.onrender.com/api',
});

/* Add a request interceptor. This function will run BEFORE every
  request is sent. It checks if we have a token in localStorage,
  and if so, it adds it to the 'x-auth-token' header.
*/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;