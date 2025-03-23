import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Lottie from "lottie-react";
import animationData from "../assets/animation1.json";

const HomeDetailPage = () => {
  return (
    <Layout>
      <div style={styles.homeContainer}>
        
        {/* Animated Background */}
        <motion.div
          style={styles.animatedBackground}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Lottie animationData={animationData} loop={true} style={styles.lottieAnimation} />
        </motion.div>

        {/* Overlay Content */}
        <div style={styles.overlayContent}>
          <motion.div
            style={styles.heroText}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 style={styles.heading}>
              Welcome to <span style={styles.highlight}>SpendLit</span>
            </h1>
            <p style={styles.subText}>
            
              Manage your money wisely with real-time tracking & insights.Because smart spending should always be lit! 🚀
            </p>
            <motion.button
              style={styles.loginButton}
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 0px 20px rgba(0, 100, 0, 0.6)"
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => window.location.href = '/login'}
            >
              Get Started 🚀
            </motion.button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

// Internal CSS Styles
const styles = {
  homeContainer: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    overflow: "hidden",
  },

  animatedBackground: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "0",
    opacity: "0.3", // Subtle animation effect
  },

  overlayContent: {
    position: "absolute",
    zIndex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    background: "rgba(255, 255, 255, 0.6)",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
  },

  heroText: {
    maxWidth: "500px",
  },

  heading: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "black",
    marginBottom: "0.5rem",
  },

  highlight: {
    color: "darkgreen",
  },

  subText: {
    fontSize: "1.2rem",
    color: "black",
    opacity: "0.8",
    marginBottom: "1.5rem",
  },

  loginButton: {
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "white",
    background: "darkgreen",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "0.3s ease-in-out",
  },

  lottieAnimation: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    // height: "100vh",
    objectFit: "cover",
  },
};

export default HomeDetailPage;
