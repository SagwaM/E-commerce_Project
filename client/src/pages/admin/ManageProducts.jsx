import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container, Modal, Form, Alert } from "react-bootstrap";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

   // Get Token from Local Storage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 🆕 Fetch products from backend
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products/", {
        headers: getAuthHeaders(),
      });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✏️ Open Add Product Modal
  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: "", category: "", stock: "", image: null });
    setShowModal(true);
  };

  // ✏️ Open Edit Product Modal
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image, // Keep existing image
    });
    setShowModal(true);
  };

  // 📝 Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📷 Handle Image Upload
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // 🔄 Submit Form (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("stock", formData.stock);
    if (formData.image && formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }else {
      console.warn("Image is missing!");
    }
  
    console.log("Form Data:", Object.fromEntries(formDataToSend));

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // Ensure authentication cookies/tokens are sent
      };
      if (editingProduct) {
        // Update product
        await axios.put(`http://localhost:5000/api/products/${productId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data", ...getAuthHeaders() },
        });

        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, ...formData } : p))
        );

        setMessage("Product updated successfully!");
      } else {
        // Add new product
        const { data } = await axios.post("http://localhost:5000/api/products/", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data", ...getAuthHeaders() },
        });

        setProducts((prev) => [...prev, data]);
        setMessage("Product added successfully!");
      }

      setMessageType("success");
      setShowModal(false);
    } catch (error) {
      setMessage("Error saving product.");
      setMessageType("danger");
      console.error("Error saving product:", error);
    }
  };

  // 🚨 Delete Product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: getAuthHeaders(),
      });
      setProducts((prev) => prev.filter((product) => product._id !== id));
      setMessage("Product deleted successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Error deleting product.");
      setMessageType("danger");
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Container>
      <h2>Manage Products</h2>
      {message && <Alert variant={messageType}>{message}</Alert>}
      
      <Button variant="primary" onClick={handleAddNew}>➕ Add Product</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
              <td>
                {product.image && <img src={product.image} alt={product.name} width="50" height="50" />}
              </td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(product)}>✏️ Edit</Button>{" "}
                <Button variant="danger" onClick={() => deleteProduct(product._id)}>🗑 Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 🔹 Modal for Add/Edit Product */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? "Edit Product" : "Add New Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group><Form.Label>Name</Form.Label><Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mt-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mt-3"><Form.Label>Price</Form.Label><Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Footwear">Footwear</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-3"><Form.Label>Stock</Form.Label><Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mt-3"><Form.Label>Product Image</Form.Label><Form.Control type="file" onChange={handleImageChange} accept="image/*" /></Form.Group>
            <Button type="submit" className="mt-3">{editingProduct ? "Update" : "Add"} Product</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageProducts;
