import React, { createContext, useState, useContext } from "react";

// Create the CartContext
const CartContext = createContext();
const initialCartItems = [
    {
      id: 1,
      name: "Smartphone",
      price: 299,
      quantity: 1,
    },
    {
      id: 2,
      name: "Running Shoes",
      price: 79,
      quantity: 2,
    },
  ];


// CartContext Provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([initialCartItems]);
  const [selectedItems, setSelectedItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const updateSelectedItems = (newSelectedItems) => {
    setSelectedItems(newSelectedItems);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        selectedItems,
        setSelectedItems,
        addToCart,
        updateSelectedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);