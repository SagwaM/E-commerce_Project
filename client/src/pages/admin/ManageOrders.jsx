import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container, Badge } from "react-bootstrap";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setOrders(response.data.orders); // Ensure to set orders properly
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders(); // Call the async function inside useEffect
  }, []);
  
  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/orders/update-status/${orderId}`, { status });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status } : order));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  

  return (
    <Container style={{ height: "100vh", width: "80vw", margin: "0" }}>
      <h1 className="my-4 d-flex text-center" >Manage Orders</h1>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user.name}</td>
              <td>
                <Badge bg={order.status === "Delivered" ? "success" : order.status === "Shipped" ? "primary" : "warning"}>
                  {order.status}
                </Badge>
              </td>
              <td>${order.totalPrice}</td>
              <td>
                <Button variant="primary" className="me-2" onClick={() => updateStatus(order._id, "Shipped")}>
                  Ship
                </Button>
                <Button variant="success" onClick={() => updateStatus(order._id, "Delivered")}>
                  Deliver
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageOrders;
