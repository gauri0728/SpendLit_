import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { logout } = useAuthContext();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log("Stored token from localStorage:", storedToken);
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <header style={styles.header}>
        <div style={styles.logo} onClick={() => navigate('/dashboard')}>
        SpendLit
        </div>
        <nav>
          <ul style={styles.navList}>
            <li><a href="/dashboard" style={styles.navLink}>Home</a></li>
            <li><a href="/category-transaction" style={styles.navLink}>Category</a></li>
            <li><a href="/add-transaction" style={styles.navLink}>Add Transaction</a></li>
            <li><a href="/Finance" style={styles.navLink}>Add Finance</a></li>
            <li><a href="/income" style={styles.navLink}>Add Income</a></li>
            <li><a href="/contact" style={styles.navLink}>Contact Us</a></li>

            {/* Conditional Authentication Buttons */}
            {token ? (
              <li>
                <button onClick={handleLogout} style={styles.logoutButton}>
                  Logout
                </button>
              </li>
            ) : (
              <li><a href="/login" style={styles.navLink}>Login</a></li>
            )}
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main style={styles.mainContent}>{children}</main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2024 SpendLit. All rights reserved.</p>
        <ul style={styles.footerLinks}>
          <li><a href="/privacy" style={styles.footerLink}>Privacy Policy</a></li>
          <li><a href="/terms" style={styles.footerLink}>Terms & Conditions</a></li>
        </ul>
      </footer>
    </div>
  );
};

// Internal CSS Styles
const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    color: "#333",
    backgroundColor: "white", // 60% White background
  },

  /* Header (Navbar) */
  header: {
    position: "sticky",
    top: 0,
    width: "100%",
    backgroundColor: "white",
    padding: "15px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  },

  logo: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "darkgreen", // Accent color
    cursor: "pointer",
  },

  navList: {
    display: "flex",
    listStyle: "none",
    gap: "20px",
    margin: 0,
    padding: 0,
  },

  navLink: {
    textDecoration: "none",
    color: "black",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "10px 15px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  },

  navLinkHover: {
    backgroundColor: "darkgreen",
    color: "white",
  },

  /* Logout Button */
  logoutButton: {
    padding: "10px 15px",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "darkgreen",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  logoutButtonHover: {
    backgroundColor: "green",
    boxShadow: "0px 0px 10px rgba(0, 100, 0, 0.5)",
  },

  /* Main Content */
  mainContent: {
    padding: "20px",
    minHeight: "calc(100vh - 140px)", // Keeps content centered
  },

  /* Footer */
  footer: {
    backgroundColor: "black", // 30% Black background
    color: "white",
    padding: "20px",
    textAlign: "center",
  },

  footerLinks: {
    listStyle: "none",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "10px",
  },

  footerLink: {
    textDecoration: "none",
    color: "white", // Accent color
    fontSize: "0.9rem",
    transition: "color 0.3s ease",
  },

  footerLinkHover: {
    color: "lightgray",
  },
};

export default Layout;
