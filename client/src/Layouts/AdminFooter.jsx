import "../styles/AdminDashboard.css";

const AdminFooter = () => {
  return (
    <footer className="admin-footer">
      <p>© {new Date().getFullYear()} E-Commerce Admin. All Rights Reserved.</p>
    </footer>
  );
};

export default AdminFooter;
