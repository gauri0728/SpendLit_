import React, { useState , useEffect } from 'react';
import axios from 'axios';
import './Contact'; // Add custom styling if needed
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // used for the authentication of the user token 
    const navigate = useNavigate();
  
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if token is missing
        navigate('/login');
      }
    }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/contact/add', formData);
      setSuccessMessage(response.data.msg);
      setErrorMessage('');
      setFormData({ name: '', email: '', message: '' }); // Clear form after submission
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || 'Failed to send message. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <Layout>
            <div className="container mt-5" style={{ maxWidth: '835px' }}>
      <h2 className="text-center mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded">
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100">Send Message</button>
      </form>
    </div>
    </Layout>

  );
};

export default Contact;
