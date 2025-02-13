import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import './index.css'
import App from './App'
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router> {/* ✅ Now AuthProvider is inside Router */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>
);