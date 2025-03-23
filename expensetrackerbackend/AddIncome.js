import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Row, Col, Container, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const AddIncome = () => {
  const [income, setIncome] = useState([]);
  const [newIncome, setNewIncome] = useState({ source: '', amount: '', date: '' });
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // ✅ Fetch Income Data from Backend
  const fetchIncome = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/income');
      setIncome(response.data);
    } catch (error) {
      console.error('Error fetching income:', error);
    }
  };

  // ✅ Fetch income when component mounts
  useEffect(() => {
    fetchIncome();
  }, []);

  // ✅ Handle Input Changes
  const handleIncomeChange = (e) => {
    const { name, value } = e.target;
    setNewIncome({ ...newIncome, [name]: value });
  };

  // ✅ Save Income (Add / Update)
  const handleSaveIncome = async (e) => {
    e.preventDefault();
    try {
      if (isEditingIncome) {
        await axios.put(`http://localhost:5000/api/income/${newIncome._id}`, newIncome);
      } else {
        await axios.post('http://localhost:5000/api/income', newIncome);
      }
      fetchIncome(); // Refresh income list
      setNewIncome({ source: '', amount: '', date: '' });
      setIsEditingIncome(false);
    } catch (error) {
      console.error('Error saving income:', error);
    }
  };

  // ✅ Edit Income
  const handleEditIncome = (incomeItem) => {
    setNewIncome(incomeItem);
    setIsEditingIncome(true);
  };

  // ✅ Delete Income
  const handleDeleteIncome = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/income/${id}`);
      fetchIncome(); // Refresh income list
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  return (
    <Layout>
      <Container>
        <Card className="p-4">
          <h4 className="text-center">Manage Income</h4>
          <Form onSubmit={handleSaveIncome}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Source</Form.Label>
                  <Form.Control type="text" name="source" value={newIncome.source} onChange={handleIncomeChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="number" name="amount" value={newIncome.amount} onChange={handleIncomeChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" name="date" value={newIncome.date} onChange={handleIncomeChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" className="btn btn-success">
              {isEditingIncome ? 'Update Income' : 'Add Income'}
            </Button>
          </Form>
        </Card>

        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th><FaMoneyBillWave /> Source</th>
              <th><FaMoneyBillWave /> Amount</th>
              <th><FaCalendarAlt /> Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {income.map((inc) => (
              <tr key={inc._id}>
                <td>{inc.source}</td>
                <td>₹{inc.amount}</td>
                <td>{new Date(inc.date).toLocaleDateString()}</td>
                <td>
                  <Button onClick={() => handleEditIncome(inc)}><FaEdit /></Button>
                  <Button variant="danger" onClick={() => handleDeleteIncome(inc._id)}><FaTrashAlt /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </Layout>
  );
};

export default AddIncome;
