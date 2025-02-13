import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container, Modal, Form } from "react-bootstrap";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" });
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Track product being edited
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null, // Image file
  });

  // Fetch products from backend
  useEffect(() => {
    
    axios
      .get("http://localhost:5000/api/products")
      .then(({ data }) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Delete Product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  // 🆕 Open Modal for Adding New Product
  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: "", category: "", stock: "", image: null });
    setShowModal(true);
  };

  // ✏️ Open Modal for Editing Product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: null, // Keep image unchanged unless updated
    });
    setShowModal(true);
  };

  // 📝 Handle Input Changes (for text, numbers)
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
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (editingProduct) {
        // Update product
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Add new product
        await axios.post("http://localhost:5000/api/products", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchProducts(); // Refresh product list
      setShowModal(false); // Close modal
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <Container>
      <h2>Manage Products</h2>
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
            <Form.Group controlId="name">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="price" className="mt-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="category" className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="stock" className="mt-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="image" className="mt-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleImageChange} accept="image/*" />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {editingProduct ? "Update" : "Add"} Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageProducts;
