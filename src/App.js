import React from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate} from 'react-router-dom';
import SignUp from './components/SignUp'; // Adjust the path as per your file structure
import Login from './components/Login'; // Adjust the path as per your file structure
import Dashboard from './Homepage/Dashboard'; // Adjust the path as per your file structure
import AddTransaction from './Homepage/AddTransaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import CategoryT from './Homepage/CategoryT';
import Contact from './Homepage/Contact';
import PrivateRoute from './components/PrivateRoute';
import HomeDetailPage from './components/HomeDetailPage';
import Finance from './Homepage/FinanceTracker';
import AddIncome from './Homepage/AddIncome';
const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // Checks if token exists in localStorage
};

// const PrivateRoute = ({ children }) => {
//   return isAuthenticated() ? children : <Navigate to="/login" replace />;
// };

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
           {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/login" element={<Login />} /> */}

           {/* Public Route */}
           <Route path="/login" element={<Login />} />
           <Route path="/" element={<HomeDetailPage />} />

{/* Private Route */}
<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
{/* <Route path="/dashboard" element={<Dashboard />} /> */}



{/* Redirect Unknown Routes to Login */}
<Route path="*" element={<Navigate to="/login" replace />} />

        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="/category-transaction" element={<CategoryT />} />
        <Route path="/Finance" element={< Finance/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/income" element={<AddIncome />} />
        {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        {/* <Route path="/" element={<Login />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
