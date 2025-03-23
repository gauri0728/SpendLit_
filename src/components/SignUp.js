import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './loginSign.css';
import { motion } from 'framer-motion';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // For redirecting after successful signup

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send signup request to backend
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password,
      });

      console.log('Signup successful:', response.data); // Debugging
      alert('Signup successful! Please log in.');

      // Redirect to Login page after successful signup
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err.response || err.message);
      alert(err.response?.data?.msg || 'Signup failed. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="container-fluid signup-page" style={{ backgroundColor: '#f8f9fa', height: '100vh' }}>
        <motion.div
          className="row-login d-flex align-items-center justify-content-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="col-lg-4 d-flex align-items-center justify-content-center">
            <motion.div
              className="form-2-wrapper bg-white shadow-lg p-5 rounded"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                maxWidth: '400px',
                marginTop: '63px',
                width: '100%',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="logo text-center mb-4">
                <h2 style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>SpendLit</h2>
              </div>
              <h3 className="text-center mb-4" style={{ color: '#333' }}>Sign Up</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3 form-box">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      padding: '10px',
                      fontSize: '16px',
                    }}
                  />
                </div>
                <div className="mb-3 form-box">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      padding: '10px',
                      fontSize: '16px',
                    }}
                  />
                </div>
                <motion.button
                  type="submit"
                  className="btn btn-outline-secondary login-btn w-100 mb-3"
                >
                  Sign Up
                </motion.button>
              </form>

              <p className="text-center login-test mt-3" style={{ color: '#666' }}>
                Already have an account?{' '}
                <a href="/login" className="text-decoration-none" style={{ color: '#4a90e2' }}>
                  Log in here
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SignUp;
