import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container } from "react-bootstrap";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then(({ data }) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const changeUserRole = (id, newRole) => {
    fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    })
      .then(() => setUsers(users.map((u) => (u._id === id ? { ...u, role: newRole } : u))))
      .catch((err) => console.error("Error updating user role:", err));
  };
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  

  return (
    <Container>
      <h1 className="my-4">Manage Users</h1>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="primary" className="me-2" onClick={() => changeUserRole(user._id, "Admin")}>
                  Make Admin
                </Button>
                <Button variant="secondary" onClick={() => changeUserRole(user._id, "Customer")}>
                  Make Customer
                </Button>
                <Button variant="danger" onClick={() => deleteUser(user._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageUsers;
