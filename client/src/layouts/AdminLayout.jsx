import {
  Link,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom"

import {
  FaUtensils,
  FaTags,
  FaHome,
  FaSignOutAlt,
  FaShoppingCart,
  FaImages,
  FaBell,
  FaQrcode,
  FaBars,
  FaTimes,
  FaChartLine,
  FaMoon,
  FaSun,
  FaCog,
  FaRegBell,
} from "react-icons/fa"

import { useState, useEffect } from "react"
import { getOrders } from "../services/orderService"
import { getWaiterCalls } from "../services/waiterCallService"
function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [orderCount, setOrderCount] = useState(0)
const [callCount, setCallCount] = useState(0)
const [pendingOrderCount, setPendingOrderCount] = useState(0)
  const [showNotifications, setShowNotifications] =
  useState(false)

  useEffect(() => {
  const fetchNotifications = async () => {
    const ordersData = await getOrders()
    const callsData = await getWaiterCalls()
    const orders = ordersData.orders || []
const calls = callsData.calls || []

setOrderCount(orders.length)

setCallCount(calls.length)

setPendingOrderCount(
  orders.filter(
    order =>
      order.status !== "completed"
  ).length
)
console.log("ORDERS ARRAY", ordersData.orders)
console.log("CALLS ARRAY", callsData.calls)
   const latestOrders =
  (ordersData.orders || [])
    .slice(0,5)
    .map(order => ({
  type: "order",
  title: order.tableNumber,
  subtitle: order.totalAmount,
  createdAt: order.createdAt
})) || []

  const latestCalls =
  (callsData.calls || [])
    .slice(0,5)
    .map(call => ({
      type: "call",
      title: call.customerName,
      subtitle: call.tableNumber,
      createdAt: call.createdAt
    }))

const latestActivity = [
  ...latestOrders,
  ...latestCalls
]
.sort(
  (a, b) =>
    new Date(b.createdAt) -
    new Date(a.createdAt)
)
.slice(0, 5)

setNotifications(latestActivity)   
  }

  fetchNotifications()

  const interval =
    setInterval(fetchNotifications, 5000)

  return () =>
    clearInterval(interval)

}, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
    setDarkMode(!darkMode)
  }

 const handleLogout = () => {
  localStorage.removeItem("userInfo")
  navigate("/admin/login", {
    replace: true,
  })
}

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
    { name: "Revenue", path: "/admin/revenue", icon: <FaChartLine /> },
    { name: "Categories", path: "/admin/categories", icon: <FaTags /> },
    { name: "Foods", path: "/admin/foods", icon: <FaUtensils /> },
    { name: "Orders", path: "/admin/orders", icon: <FaShoppingCart /> },
    { name: "Banners", path: "/admin/banners", icon: <FaImages /> },
    { name: "Waiter Calls", path: "/admin/waiter-calls", icon: <FaBell /> },
    { name: "QR Generator", path: "/admin/qr-generator", icon: <FaQrcode /> },
  ]

  return (
    <div className="h-screen overflow-hidden bg-[#FDF8F5] dark:bg-gray-900 flex">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-[#c84b2f] to-[#a63a21] text-white flex flex-col transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* TOP - Logo Area */}
        <div className="p-6 border-b border-white/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl font-bold backdrop-blur-sm">
              🍽️
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide">
                Aura Kitchenmet
              </h1>
              <p className="text-white/70 text-xs">Restaurant Admin</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto p-6">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-5 py-3 rounded-xl font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-white text-[#c84b2f] shadow-lg"
                    : "hover:bg-white/10"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* LOGOUT */}
        <div className="p-6 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-3 transition-all"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-[#c84b2f]/20 dark:border-gray-700 px-4 md:px-6 py-3 flex justify-between items-center shadow-sm">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden bg-[#c84b2f]/10 dark:bg-gray-700 text-[#c84b2f] dark:text-white p-2 rounded-lg"
            >
              <FaBars />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#c84b2f] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                G
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                  Admin Panel
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs hidden sm:block">
                  Restaurant Control Center
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT - Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Dark/Light Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            {/* Notification */}
            <div className="relative">

  <button
    onClick={() =>
      setShowNotifications(
        !showNotifications
      )
    }
    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all relative"
  >
    <FaRegBell size={18} />

    <span className="absolute top-1 right-1 w-2 h-2 bg-[#c84b2f] rounded-full"></span>
  </button>

  {showNotifications && (

    <div
      className="
      absolute
      right-0
      top-12
      w-80
      bg-white
      dark:bg-gray-800
      rounded-2xl
      shadow-2xl
      border
      border-gray-200
      dark:border-gray-700
      p-4
      z-50
    "
    >

      <div className="flex justify-between items-center mb-3">

        <h3 className="font-bold text-gray-800 dark:text-white">
          Notifications
        </h3>

        <button
          onClick={() =>
            setShowNotifications(false)
          }
          className="text-gray-500 hover:text-red-500"
        >
          <FaTimes />
        </button>

      </div>

      <div className="space-y-2">

  {notifications.length === 0 ? (

    <p className="text-center text-gray-500">
      No Notifications
    </p>

  ) : (

   notifications.map((item, index) => (

        <div
          key={index}
          className="
            p-3
            rounded-xl
            bg-orange-50
            border
            border-orange-100
          "
        >

          <p className="text-sm font-medium text-gray-800">

            {item.type === "order"
  ? `🛒 Order received from Table No ${item.title}`
  : `🔔 Call received from Table No ${item.subtitle}`}

          </p>

        </div>

      ))

  )}

</div>

    </div>

  )}

</div>

            {/* Settings */}
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              <FaCog size={18} />
            </button>

            {/* Admin Badge */}
            <div className="hidden md:block bg-[#c84b2f] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md">
              Admin
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout