import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import { lazy } from "react"
import CustomerLayout from "../layouts/CustomerLayout"
import AdminLayout from "../layouts/AdminLayout"

import ProtectedRoute from "./ProtectedRoute"

// Customer Pages
const MenuPage = lazy(() =>
  import("../pages/customer/MenuPage")
)

// Admin Pages
import Login from "../pages/admin/Login"
import Dashboard from "../pages/admin/Dashboard"


const Foods = lazy(() =>
  import("../pages/admin/Foods")
)

const Orders = lazy(() =>
  import("../pages/admin/Orders")
)

const Categories = lazy(() =>
  import("../pages/admin/Categories")
)

const Banners = lazy(() =>
  import("../pages/admin/Banners")
)

const WaiterCalls = lazy(() =>
  import("../pages/admin/WaiterCalls")
)

const QRGenerator = lazy(() =>
  import("../pages/admin/QRGenerator")
)

const Revenue = lazy(() =>
  import("../pages/admin/Revenue")
)

const Advertisements = lazy(() =>
  import("../pages/admin/Advertisements")
)
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