# MERN Stack E-Commerce Platform

## 📌 Overview
This project is a **full-fledged E-Commerce platform** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It includes features like **user authentication, product management, order processing, M-Pesa payment integration, admin dashboard, and customer order tracking**.

---

## 🚀 Live Deployment
- **Frontend**: [Shopsphere Frontend](https://shopsphere-sigma-six.vercel.app/)
- **Backend**: [Shopsphere Backend](https://e-commerce-project-kqmm.onrender.com)

### 🔑 Testing Credentials
#### **Admin Login**
- **Email**: admin@example.com
- **Password**: Admin@123

#### **Customer Login**
- **Email**: customer@example.com
- **Password**: Customer@123

---

## 🚀 Features
### 💩 User Authentication
- Sign up, login, and logout functionality.
- Role-based authentication (Admin, Customer).
- JWT-based authentication for secure access.

### 💩 Product Management
- Admin can **add, edit, delete, and manage products**.
- Customers can **view products, filter by category, search for products**.

### 💩 Cart & Order Management
- Add/remove items from the cart.
- Customers can **place orders**.
- Admin can **update order status (Pending, Shipped, Delivered)**.

### 💩 Payment Integration
- M-Pesa payment gateway integration.
- Order summary before checkout (subtotal, tax, shipping, discounts, final total).

### 💩 Dashboard
- **Admin Dashboard**: Manage users, orders, and products.
- **Customer Dashboard**: Track orders and manage profile.

---

## 🛠️ Tech Stack
| Technology     | Usage |
|---------------|----------------|
| **Frontend**  | React.js, Bootstrap |
| **Backend**   | Node.js, Express.js |
| **Database**  | MongoDB (Mongoose ORM) |
| **Authentication** | JWT (JSON Web Token) |
| **Styling** | Bootstrap |
| **Deployment** | Render (Backend), Vercel (Frontend) |

---

## ⚙️ Installation & Setup

### 💮 Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Yarn](https://yarnpkg.com/) (for frontend)
- [NPM](https://www.npmjs.com/) (for backend)

### 💩 Clone the Repository
```bash
git clone https://github.com/SagwaM/ecommerce-platform.git
cd ecommerce-platform
```

### 💩 Backend Setup
```bash
cd backend
npm install   # Install dependencies
npm start     # Start backend server
```

### 💩 Frontend Setup
```bash
cd frontend
yarn install  # Install dependencies
yarn dev      # Start frontend server
```

The app will now be running at **http://localhost:5173/** (frontend) and **http://localhost:5000/** (backend).

---

## 🔒 API Endpoints
### 💩 Authentication
| Method | Endpoint | Description |
|--------|-------------------------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

### 💩 Products
| Method | Endpoint | Description |
|--------|-------------------------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get a single product by ID |
| POST | `/api/products` | Add a new product (Admin) |
| PUT | `/api/products/:id` | Update product details (Admin) |
| DELETE | `/api/products/:id` | Delete a product (Admin) |

### 💩 Orders
| Method | Endpoint | Description |
|--------|-------------------------|-------------|
| GET | `/api/orders` | Get all orders (Admin) |
| GET | `/api/orders/:id` | Get order details by ID |
| POST | `/api/orders` | Create a new order |
| PUT | `/api/orders/update-status/:id` | Update order status (Admin) |
| DELETE | `/api/orders/:id` | Cancel an order |

### 💩 Users
| Method | Endpoint | Description |
|--------|-------------------------|-------------|
| GET | `/api/users` | Get all users (Admin) |
| GET | `/api/users/:id` | Get user details by ID |
| PUT | `/api/users/:id` | Update user information |
| DELETE | `/api/users/:id` | Delete a user (Admin) |

---

## 🔒 Authentication & Security
- **JWT Authentication**: Ensures secure user authentication.
- **Role-based Access Control**: Admin and Customer have different permissions.
- **Secure API Routes**: Only authorized users can access certain endpoints.

---

## 🚀 Deployment Guide
### 💩 Backend Deployment (Render)
1. Push your backend code to GitHub.
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set **Root Directory** to `backend`.
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `npm start`
7. Add necessary environment variables in **Settings**.
8. Click **Deploy** and wait for the deployment to complete.

### 💩 Frontend Deployment (Vercel)
1. Push your frontend code to GitHub.
2. Go to [Vercel](https://vercel.com/) and **Import Project**.
3. Connect your GitHub repository.
4. Set **Root Directory** to `frontend`.
5. Set **Build Command**: `yarn install && yarn build`
6. Set **Output Directory**: `dist`
7. Add necessary environment variables in **Settings**.
8. Click **Deploy** and wait for the deployment to complete.

---

## 🛠️ Future Enhancements
- Implement **email notifications** for order updates.
- Add **reviews & ratings** for products.
- Optimize **performance & SEO**.

---

## 🙌 Contributing
Feel free to **fork** this repository, create a feature branch, and submit a PR.

```bash
git checkout -b feature-branch
git commit -m "Added new feature"
git push origin feature-branch
```

---

## 📝 License
This project is licensed under the MIT License.

---

## 💌 Contact
For any questions or suggestions, feel free to reach out:
- **Email**: maria.sagwa@strathmore.edu
- **GitHub**: [SagwaM](https://github.com/SagwaM)


---

🚀 **Happy Coding!** 🎉

