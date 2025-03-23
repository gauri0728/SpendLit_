// import React from 'react';
// import { Navigate } from 'react-router-dom';  // Import Navigate from react-router-dom

// const getToken = () => {
//     return localStorage.getItem('token');
//   };
  
//   const PrivateRoute = ({ element, ...rest }) => {
//     const token = getToken(); // Using the getToken function
    
//     return token ? element : <Navigate to="/login" />;
//   };
  

// export default PrivateRoute;


import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

