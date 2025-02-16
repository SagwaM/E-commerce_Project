import { useState, useEffect, useRef } from "react";
import { Bar, Line } from "react-chartjs-2";
import { FaUsers, FaShoppingCart, FaBox, FaDollarSign } from "react-icons/fa";
import "../../styles/AdminDashboard.css";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const salesChartRef = useRef(null)

  useEffect(() => {
    console.log("🔄 Dashboard Mounted");
    
    // Fetch dashboard stats
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`)
      .then(({ data }) => setStats(data))
      .catch((error) => console.error("🚨 Stats Fetch Error:", error));

    // Fetch recent orders
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/recent-orders`)
      .then(({ data }) => setRecentOrders(data))
      .catch((error) => console.error("🚨 Orders Fetch Error:", error));

    // Fetch sales report
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/sales-report`)
      .then(({ data }) => setSalesData(data))
      .catch((error) => console.error("🚨 Sales Report Fetch Error:", error));

    setLoading(false); // Set loading to false after fetching data
  }, []);

  const chartData = {
    labels: ["Orders", "Revenue", "Products", "Users"],
    datasets: [
      {
        label: "Admin Statistics",
        data: [
          stats.totalOrders || 0, 
          stats.totalRevenue || 0, 
          stats.totalProducts || 0, 
          stats.totalUsers || 0
        ],
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
      },
    ],
  };

  const salesChartData = {
    labels: salesData ? salesData.dates : [],
    datasets: [
      {
        label: "Revenue",
        data: salesData ? salesData.revenue : [],
        borderColor: "#28a745",
        fill: false,

      },
    ],
  };

  return (
    <div className="dashboard" style={{ height: "100vh", width: "80vw", margin: "0" }}>
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* ✅ Quick Stats Section */}
      <div className="stats-grid" >
        <div className="stats-card" >
          <FaShoppingCart className="stats-icon orders" />
          <div>
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stats-card">
          <FaDollarSign className="stats-icon revenue" />
          <div>
            <h3>${stats.totalRevenue}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stats-card">
          <FaBox className="stats-icon products" />
          <div>
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stats-card">
          <FaUsers className="stats-icon users" />
          <div>
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
      </div>

      {/* ✅ Recent Orders Section */}
      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.customer}</td>
                  <td className={`status ${order.status.toLowerCase()}`}>{order.status}</td>
                  <td>${order.total}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No recent orders</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Chart Section */}
      <div className="chart-container">
        <h2>Business Overview</h2>
        <Bar ref={chartRef} data={chartData} />
      </div>
      <div className="chart-container">
        <h2>Sales Report</h2>
        {salesData ? <Line ref={salesChartRef} data={salesChartData} /> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default Dashboard;
// In this file, we have a Dashboard component that fetches data from the backend to display admin dashboard stats and recent orders. We're using the useState and useEffect hooks to manage state and fetch data respectively.