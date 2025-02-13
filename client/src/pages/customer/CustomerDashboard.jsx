import Sidebar from "../../components/Sidebar";

const CustomerDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Customer Dashboard</h1>
        <p>Welcome! Track your orders and manage your profile.</p>
      </div>
    </div>
  );
};

export default CustomerDashboard;
