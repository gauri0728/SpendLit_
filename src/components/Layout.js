import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { logout } = useAuthContext();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.layout}>
      {/* Navbar */}
      <header style={styles.navbar}>
        <div style={styles.logo} onClick={() => navigate("/dashboard")}>
          SpendLit
        </div>

        {/* Desktop Navigation */}
        <nav style={styles.desktopNav}>
          <ul style={styles.navList}>
            <li><span onClick={() => navigate("/dashboard")} style={styles.navItem}>Home</span></li>
            <li><span onClick={() => navigate("/category-transaction")} style={styles.navItem}>Category</span></li>
            <li><span onClick={() => navigate("/add-transaction")} style={styles.navItem}>Add Transaction</span></li>
            <li><span onClick={() => navigate("/Finance")} style={styles.navItem}>Add Finance</span></li>
            <li><span onClick={() => navigate("/income")} style={styles.navItem}>Add Income</span></li>
            <li><span onClick={() => navigate("/contact")} style={styles.navItem}>Contact Us</span></li>
            {token ? (
              <li>
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
              </li>
            ) : (
              <li><span onClick={() => navigate("/login")} style={styles.navItem}>Login</span></li>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button style={styles.mobileMenuButton} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          ☰
        </button>
      </header>

      {/* Mobile Navigation (Collapsible) */}
      {isMobileMenuOpen && (
        <nav style={styles.mobileNav}>
          <ul style={styles.mobileNavList}>
            <li><span onClick={() => { navigate("/dashboard"); setIsMobileMenuOpen(false); }} style={styles.navItem}>Home</span></li>
            <li><span onClick={() => { navigate("/category-transaction"); setIsMobileMenuOpen(false); }} style={styles.navItem}>Category</span></li>
            <li><span onClick={() => { navigate("/add-transaction"); setIsMobileMenuOpen(false); }} style={styles.navItem}>Add Transaction</span></li>
            <li><span onClick={() => { navigate("/Finance"); setIsMobileMenuOpen(false); }} style={styles.navItem}>Add Finance</span></li>
            <li><span onClick={() => { navigate("/income"); setIsMobileMenuOpen(false); }} style={styles.navItem}>Add Income</span></li>
            <li><span onClick={() => { navigate("/contact"); setIsMobileMenuOpen(false); }} style={styles.navItem}>Contact Us</span></li>
            {token ? (
              <li>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} style={styles.logoutButton}>Logout</button>
              </li>
            ) : (
              <li><span onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }} style={styles.navItem}>Login</span></li>
            )}
          </ul>
        </nav>
      )}


      {/* Main Content */}
      <main style={styles.mainContent}>{children}</main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2024 SpendLit. All rights reserved.</p>
        <ul style={styles.footerLinks}>
          <li><span onClick={() => navigate("/privacy")} style={styles.footerLink}>Privacy Policy</span></li>
          <li><span onClick={() => navigate("/terms")} style={styles.footerLink}>Terms & Conditions</span></li>
        </ul>
      </footer>
    </div>
  );
};

const styles = {
  layout: {
    fontFamily: "'Poppins', sans-serif",
    color: "#333",
    backgroundColor: "white",
  },
  navbar: {
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
    color: "darkgreen",
    cursor: "pointer",
  },
  desktopNav: {
    display: "flex",
  },
  navList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  navItem: {
    textDecoration: "none",
    color: "black",
    fontSize: "1rem",
    fontWeight: 500,
    padding: "10px 15px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
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
  mobileMenuButton: {
    display: "none",
    fontSize: "1.5rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "black",
  },
  mobileNav: {
    position: "absolute",
    top: "60px",
    left: 0,
    width: "100%",
    backgroundColor: "white",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  mobileNavList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  mainContent: {
    padding: "20px",
    minHeight: "calc(100vh - 140px)",
  },
  footer: {
    backgroundColor: "black",
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
    color: "white",
    fontSize: "0.9rem",
    transition: "color 0.3s ease",
    cursor: "pointer",
  },
};

/* Responsive Styles */
window.innerWidth < 768 && (styles.desktopNav.display = "none", styles.mobileMenuButton.display = "block");

export default Layout;
