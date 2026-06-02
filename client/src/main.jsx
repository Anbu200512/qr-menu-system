import React from "react"
import ReactDOM from "react-dom/client"

import App from "./App"

import "./index.css"

import ThemeProvider from "./context/ThemeContext"
import AuthProvider from "./context/AuthContext"
import CartProvider from "./context/CartContext"
import { Toaster } from "react-hot-toast"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
  <AuthProvider>
    <CartProvider>
      <Toaster position="top-right" />

      <App />
    </CartProvider>
  </AuthProvider>
</ThemeProvider>
  </React.StrictMode>
)