import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './loginSign.css'; // Ensure this file has updated styles
import Layout from './Layout';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, isNewUser } = response.data;

      localStorage.setItem('token', token);

      if (isNewUser) {
        await axios.post(
          'http://localhost:5000/api/transactions/reset',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response || err.message);
      alert(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };
  return (
    <Layout>
      <div className="container-fluid login-page" style={{ backgroundColor: '#f8f9fa', height: '100vh' }}>
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
                'margin-top': '63px',
                width: '100%',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="logo text-center mb-4">
                <h2 style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>SpendLit</h2>
              </div>
              <h3 className="text-center mb-4" style={{ color: '#333' }}>Login</h3>
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
                  Login
                </motion.button>
              </form>

              <p className="text-center register-test mt-3" style={{ color: '#666' }}>
                Don't have an account?{' '}
                <a href="/signup" className="text-decoration-none" style={{ color: '#4a90e2' }}>
                  Register here
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
