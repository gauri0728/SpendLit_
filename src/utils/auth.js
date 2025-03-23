// Utility functions for handling authentication tokens in localStorage

// Set JWT token in localStorage
export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Get JWT token from localStorage
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Remove JWT token from localStorage (Logout)
  export const removeToken = () => {
    localStorage.removeItem('token');
  };

  

