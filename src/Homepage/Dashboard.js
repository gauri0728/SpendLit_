import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import useAuth from '../hooks/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [expensesData, setExpensesData] = useState([]);
  const [financeData, setFinanceData] = useState([]);
  const [filter, setFilter] = useState('week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);


  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/transactions/${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setExpensesData(response.data);
        setRecentTransactions(response.data); // <-- Make sure to store the data
      } catch (err) {
        console.error('Error fetching expenses data:', err);
        setError('Failed to fetch expenses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [filter]);
  
  // Function to get category icons
const getCategoryIcon = (category) => {
  const categoryIcons = {
    Food: "🍔",
    Transport: "🚕",
    Shopping: "🛍️",
    Bills: "💡",
    Entertainment: "🎮",
    Health: "🏥",
    Salary: "💰",
    Others: "🛠️"
  };
  
  return categoryIcons[category] || "💸"; // Default icon if category not found
};


  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch Expenses Data
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/transactions/${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpensesData(response.data);
      } catch (err) {
        console.error('Error fetching expenses data:', err);
        setError('Failed to fetch expenses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [filter]);

  // Fetch Finance Data
  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/finance/all");
        setFinanceData(response.data);
      } catch (error) {
        console.error("Error fetching finance data:", error);
      }
    };
    fetchFinanceData();
  }, []);

  // Process Expense Data
  const processData = (data) => {
    if (!data || data.length === 0) {
      return {
        pieData: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
        barData: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
        categories: {},
      };
    }

    const labels = [];
    const expenses = [];
    const categories = {};

    data.forEach((expense) => {
      const date = new Date(expense.date);
      const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!labels.includes(dateStr)) labels.push(dateStr);
      expenses.push(expense.amount);

      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });

    const pieData = {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'],
        },
      ],
    };

    const barData = {
      labels,
      datasets: [
        {
          label: 'Expense Amount',
          data: expenses,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };

    return { pieData, barData, categories };
  };

  const { pieData, barData, categories } = processData(expensesData);

  // Prepare Finance Chart Data
  const financeChartData = {
    labels: ["SIP", "HRA", "Loans", "Savings", "Travel", "Stocks", "Expenses"],
    datasets: [
      {
        data: financeData.length
          ? [
              financeData[0].sip,
              financeData[0].hra,
              financeData[0].loans,
              financeData[0].savings,
              financeData[0].travel,
              financeData[0].stocks,
              financeData[0].expenses
            ]
          : [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: ["#2ecc71", "#e67e22", "#f1c40f", "#3498db", "#9b59b6", "#34495e", "#e74c3c"],
      }
    ]
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="text-center text-primary fw-bold">SpendLit Dashboard</h2>

        <div className="d-flex justify-content-between align-items-center my-3">
          <div>
            <label className="fw-bold me-2">Filter by:</label>
            <select className="form-select d-inline-block w-auto" onChange={(e) => setFilter(e.target.value)} value={filter}>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="6months">6 Months</option>
              <option value="year">Year</option>
            </select>
          </div>
        </div>

        <div className="row">
          {/* Pie Chart - Expenses */}
          <div className="col-md-6">
            <div className="card shadow-lg mb-4">
              <div className="card-header bg-primary text-white">Expense Categories</div>
              <div className="card-body">
                <div style={{ height: '300px', width: '100%' }}>
                  <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>

          {/* Pie Chart - Finance */}
          <div className="col-md-6">
            <div className="card shadow-lg mb-4">
              <div className="card-header bg-success text-white">Finance Overview</div>
              <div className="card-body">
                <div style={{ height: '300px', width: '100%' }}>
                  <Pie data={financeChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="row">
          <div className="col-md-12">
            <div className="card shadow-lg mb-4">
              <div className="card-header bg-warning text-white">Expense Stats</div>
              <div className="card-body">
                <div style={{ height: '300px', width: '100%' }}>
                  <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>
        </div>

         {/* Category Breakdown Table */}
         <div className="col-md-6">
            <div className="card shadow-lg">
              <div className="card-header bg-warning text-white">Category Breakdown</div>
              <div className="card-body">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(categories).map(([category, amount], index) => (
                      <tr key={index}>
                        <td>{category}</td>
                        <td>${amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>


                  {/* Recent Transactions */}
        <div className="card shadow-lg mb-4">
          <div className="card-header bg-dark text-white">Recent Transactions</div>
          <div className="card-body">
            <ul className="list-group">
              {recentTransactions.map((transaction, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    {getCategoryIcon(transaction.category)}
                    <span className="ms-3 fw-bold">{transaction.category}</span>
                  </div>
                  <span className="fw-bold text-success">${transaction.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
          
      </div>
    </Layout>
  );
};

export default Dashboard;
