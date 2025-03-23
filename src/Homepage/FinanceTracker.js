import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Layout from "../components/Layout";

ChartJS.register(ArcElement, Tooltip, Legend);

const FinanceTracker = () => {
  const [financeData, setFinanceData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formValue, setFormValue] = useState("");

  const fetchFinanceData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/finance/all");
      setFinanceData(response.data[0]); // Assuming one entry exists
    } catch (error) {
      console.error("Error fetching finance data:", error);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setFormValue(financeData[category]);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormValue(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      const updatedData = { ...financeData, [selectedCategory]: formValue };

      await axios.put(`http://localhost:5000/api/finance/update/${financeData._id}`, updatedData);
      alert(`${selectedCategory.toUpperCase()} updated successfully!`);

      setShowModal(false);
      fetchFinanceData();
    } catch (error) {
      console.error("Error updating finance data:", error);
    }
  };

  const handleDelete = async (category) => {
    try {
      const updatedData = { ...financeData, [category]: 0 };

      await axios.put(`http://localhost:5000/api/finance/update/${financeData._id}`, updatedData);
      alert(`${category.toUpperCase()} reset to 0!`);

      fetchFinanceData();
    } catch (error) {
      console.error("Error deleting finance data:", error);
    }
  };

  const chartData = {
    labels: ["SIP", "HRA", "Loans", "Savings", "Travel", "Stocks", "Expenses"],
    datasets: [
      {
        data: financeData
          ? [financeData.sip, financeData.hra, financeData.loans, financeData.savings, financeData.travel, financeData.stocks, financeData.expenses]
          : [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: ["#1E5128", "#e67e22", "#f1c40f", "#3498db", "#9b59b6", "#34495e", "#e74c3c"],
        hoverBackgroundColor: ["#145A32", "#d35400", "#f39c12", "#2980b9", "#8e44ad", "#2c3e50", "#c0392b"],
      },
    ],
  };

  return (
    <Layout>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h2 className="mb-4 text-dark" style={styles.title}>💰 Finance Tracker</h2>
          </Col>
        </Row>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update {selectedCategory?.toUpperCase()}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Enter New Amount (₹)</Form.Label>
                <Form.Control type="number" value={formValue} onChange={handleChange} required />
              </Form.Group>
              <Button onClick={handleUpdate} style={styles.submitButton}>
                ✅ Update
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Row className="mt-5">
          <Col md={6}>
            <Card style={styles.pieChartCard}>
              <h4 className="text-center text-dark">📊 Financial Overview</h4>
              <Pie data={chartData} />
            </Card>
          </Col>

          <Col md={6}>
            <Row>
              {financeData &&
                Object.entries(financeData)
                  .filter(([key]) => key !== "_id" && key !== "createdAt" && key !== "__v")
                  .map(([key, value], index) => (
                    <Col md={6} key={index} className="mb-3">
                      <Card style={styles.financeCard}>
                        <Card.Body className="text-center">
                          <h5 className="text-white">{key.toUpperCase()}</h5>
                          <h3 className="text-white">₹{value}</h3>
                          <Button
                            variant="light"
                            size="sm"
                            onClick={() => handleEditClick(key)}
                            style={styles.actionButton}
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(key)}
                            style={styles.actionButton}
                          >
                            🗑️ Delete
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

const styles = {
  title: {
    fontWeight: "bold",
    color: "black",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  submitButton: {
    backgroundColor: "darkgreen",
    color: "white",
    width: "100%",
    marginTop: "15px",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
  },
  financeCard: {
    padding: "20px",
    textAlign: "center",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
    backgroundColor: "black",
    color: "white",
  },
  actionButton: {
    margin: "5px",
    fontWeight: "bold",
    padding: "6px 12px",
    borderRadius: "5px",
    backgroundColor: "darkgreen",
    border: "none",
    color: "white",
  },
  pieChartCard: {
    padding: "20px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
  },
};

export default FinanceTracker;
