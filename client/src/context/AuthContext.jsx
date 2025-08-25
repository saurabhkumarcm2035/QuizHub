import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 1. Add loading state

  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('token', token);
        const decodedUser = jwtDecode(token);
        setUser(decodedUser.user);
        api.defaults.headers.common['x-auth-token'] = token;
      } else {
        localStorage.removeItem('token');
        setUser(null);
        delete api.defaults.headers.common['x-auth-token'];
      }
    } catch (error) {
      // Handle potential errors from bad tokens in localStorage
      console.error("Invalid token found in localStorage", error);
      setToken(null); 
    } finally {
      setLoading(false); // 2. Set loading to false after the check is complete
    }
  }, [token]);

  const logout = () => {
    setToken(null);
  };

  // 3. Expose the loading state
  return (
    <AuthContext.Provider value={{ user, token, setToken, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;