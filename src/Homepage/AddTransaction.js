import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { Table, Button, Pagination, Form, Row, Col, Container, Card } from 'react-bootstrap';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';

const AddTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  const [newTransaction, setNewTransaction] = useState({
    id: '',
    title: '',
    amount: '',
    category: '',
    description: '',
    type: '',
    date: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchTransactions = async () => {
    try {
      const endpoint = filter === 'all' ? '' : `/${filter}`;
      const response = await axios.get(`http://localhost:5000/api/transactions${endpoint}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/transactions/${newTransaction._id}`, newTransaction);
      } else {
        await axios.post('http://localhost:5000/api/transactions', newTransaction);
      }
      fetchTransactions();
      setNewTransaction({
        id: '',
        title: '',
        amount: '',
        category: '',
        description: '',
        type: '',
        date: '',
      });
      setIsEditing(false);
      setPage(1);
    } catch (error) {
      console.error(isEditing ? 'Error updating transaction:' : 'Error adding transaction:', error);
    }
  };

  const handleEditTransaction = (transaction) => {
    setNewTransaction(transaction);
    setIsEditing(true);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const indexOfLastTransaction = page * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const handlePageChange = (pageNumber) => setPage(pageNumber);

  return (
    <Layout>
      <Container className="dashboard-container mt-4">
        {/* Add/Edit Transaction Section */}
        <Card className="shadow-lg transaction-card">
          <Card.Body>
            <h3 className="text-center mb-4">{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</h3>
            <Form onSubmit={handleSaveTransaction}>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={newTransaction.title}
                      placeholder="Transaction Title"
                      onChange={handleInputChange}
                      required
                      className="custom-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formAmount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="amount"
                      value={newTransaction.amount}
                      placeholder="Amount"
                      onChange={handleInputChange}
                      required
                      className="custom-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Select name="category" value={newTransaction.category} onChange={handleInputChange} required>
                      <option value="">Select Category</option>
                      <option value="Food">Food</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Salary">Salary</option>
                      <option value="Savings">Savings</option>
                      <option value="Investment">Investment</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formType">
                    <Form.Label>Type</Form.Label>
                    <Form.Select name="type" value={newTransaction.type} onChange={handleInputChange} required>
                      <option value="">Select Type</option>
                      <option value="expense">Expense</option>
                      <option value="credit">Credit</option>
                      <option value="saving">Saving</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="date" value={newTransaction.date} onChange={handleInputChange} required className="custom-input"/>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={2} name="description" value={newTransaction.description} placeholder="Description" onChange={handleInputChange} className="custom-input"/>
              </Form.Group>

              <Button type="submit" variant="success" className="w-100">
                {isEditing ? 'Update Transaction' : <><FaPlusCircle /> Add Transaction</>}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Transactions Table */}
        <Card className="mt-4 shadow-lg">
          <Card.Body>
            <h3 className="text-center">Transaction List</h3>
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.title}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.date}</td>
                    <td>
                      <Button variant="primary" className="me-2" onClick={() => handleEditTransaction(transaction)}>
                        <FaEdit />
                      </Button>
                      <Button variant="danger" onClick={() => handleDeleteTransaction(transaction._id)}>
                        <FaTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
};

export default AddTransaction;
