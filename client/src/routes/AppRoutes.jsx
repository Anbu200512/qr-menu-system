import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import CustomerLayout from "../layouts/CustomerLayout"
import AdminLayout from "../layouts/AdminLayout"

import ProtectedRoute from "./ProtectedRoute"
import Orders from "../pages/admin/Orders"
// Customer Pages
import MenuPage from "../pages/customer/MenuPage"

// Admin Pages
import Login from "../pages/admin/Login"
import Dashboard from "../pages/admin/Dashboard"
import Foods from "../pages/admin/Foods"
import Categories from "../pages/admin/Categories"
import Banners from "../pages/admin/Banners"
import WaiterCalls from "../pages/admin/WaiterCalls"
import QRGenerator from "../pages/admin/QRGenerator"
import Revenue from "../pages/admin/Revenue"
import Advertisements from "../pages/admin/Advertisements"
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route
          path="/"
          element={<CustomerLayout />}
        >
          <Route
  path="/menu"
  element={<MenuPage />}
/>

<Route
  path="/menu/table/:tableId"
  element={<MenuPage />}
/>
        </Route>

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={<Login />}
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
  path="revenue"
  element={<Revenue />}
/>

          <Route
            path="orders"
            element={<Orders />}
          />

          <Route
            path="foods"
            element={<Foods />}
          />

          <Route
            path="categories"
            element={<Categories />}
          />

          <Route
  path="banners"
  element={<Banners />}
/>

<Route
  path="waiter-calls"
  element={<WaiterCalls />}
/>

<Route
  path="qr-generator"
  element={<QRGenerator />}
/>
          <Route
  path="advertisements"
  element={<Advertisements />}
/>
        </Route>

        
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes