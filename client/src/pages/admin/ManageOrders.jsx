import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container, Badge } from "react-bootstrap";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders", { withCredentials: true })
      .then(({ data }) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/update-status/${orderId}`, { status });
      setOrders(orders.map(order => order._id === orderId ? { ...order, status } : order));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  

  return (
    <Container>
      <h1 className="my-4">Manage Orders</h1>
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
              <td>{order.customer}</td>
              <td>
                <Badge bg={order.status === "Delivered" ? "success" : order.status === "Shipped" ? "primary" : "warning"}>
                  {order.status}
                </Badge>
              </td>
              <td>${order.total}</td>
              <td>
                <Button variant="primary" className="me-2" onClick={() => updateOrderStatus(order._id, "Shipped")}>
                  Ship
                </Button>
                <Button variant="success" onClick={() => updateOrderStatus(order._id, "Delivered")}>
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
