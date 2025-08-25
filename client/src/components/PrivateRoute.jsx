import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // While we're checking for a token, show a loading message
    return <h2>Loading...</h2>;
  }

  // After loading, if there's a user, show the page. Otherwise, redirect.
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;