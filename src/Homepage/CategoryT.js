import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Pagination, ProgressBar, Card } from "react-bootstrap";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { FaSync, FaFilter, FaChartPie, FaMoneyBillWave } from "react-icons/fa"; 
import "./CategoryT.css";

const CategoryT = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  const [summary, setSummary] = useState({ saving: 0, credit: 0, expense: 0, turnover: 0 });
  const [categoryData, setCategoryData] = useState({ income: {}, expense: {} });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, typeFilter, transactions]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const applyFilters = () => {
    let filtered = transactions;

    if (filter === "last-week") {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      filtered = filtered.filter((t) => new Date(t.date) >= lastWeek);
    } else if (filter === "last-month") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filtered = filtered.filter((t) => new Date(t.date) >= lastMonth);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    setFilteredTransactions(filtered);

    const saving = filtered.filter((t) => t.type === "saving").reduce((acc, curr) => acc + curr.amount, 0);
    const credit = filtered.filter((t) => t.type === "credit").reduce((acc, curr) => acc + curr.amount, 0);
    const expense = filtered.filter((t) => t.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);

    setSummary({ saving, credit, expense, turnover: saving - expense });

    setCategoryData({
      income: calculateCategoryData(filtered, "credit"),
      expense: calculateCategoryData(filtered, "expense"),
    });
  };

  const calculateCategoryData = (transactions, type) => {
    const data = {};
    transactions.filter((t) => t.type === type).forEach((t) => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });

    const total = Object.values(data).reduce((acc, curr) => acc + curr, 0);
    const percentages = {};
    for (const category in data) {
      percentages[category] = Math.round((data[category] / total) * 100);
    }
    return percentages;
  };

  const resetFilters = () => {
    setFilter("all");
    setTypeFilter("all");
  };

  const indexOfLastTransaction = page * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <Layout>
      <div className="dashboard">
        
        <div className="filter-container">
          <div>
            <FaFilter /> <label>Select Frequency</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="last-week">Last Week</option>
              <option value="last-month">Last Month</option>
            </select>
          </div>
          <div>
            <FaChartPie /> <label>Type</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="saving">Saving</option>
              <option value="credit">Credit</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <Button onClick={resetFilters}>
            <FaSync /> Reset
          </Button>
        </div>

        <div className="summary-container">
          <Card className="summary-card">
            <h5>Total Transactions: {filteredTransactions.length}</h5>
            <p><FaMoneyBillWave /> Saving:₹ {summary.saving} | Expense:₹ {summary.expense}</p>
          </Card>
          <Card className="summary-card">
            <h5>Total : ₹{summary.turnover} </h5>
          </Card>
        </div>

        <Table striped bordered hover responsive variant="dark">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((t) => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{t.amount} ₹</td>
                <td>{t.category}</td>
                <td>{t.type}</td>
                <td>{new Date(t.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Layout>
  );
};

export default CategoryT;
