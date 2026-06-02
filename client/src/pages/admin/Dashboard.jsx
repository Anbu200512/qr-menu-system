import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

import {
  FaShoppingCart,
  FaUtensils,
  FaMoneyBillWave,
  FaBell,
  FaQrcode,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa"

import {
  getOrders,
} from "../../services/orderService"

import {
  getFoods,
} from "../../services/foodService"

import {
  getWaiterCalls,
} from "../../services/waiterCallService"

function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalFoods: 0,
    waiterCalls: 0,
    pendingOrders: 0,
    completedOrders: 0,
    recentOrders: [],
    recentCalls: [],
  })

  const fetchDashboard = async () => {
    try {
      const ordersData = await getOrders()
      const orders = ordersData.orders || []

      const foodsData = await getFoods()
      const foods = foodsData.foods || []

      const waiterData = await getWaiterCalls()
      const calls = waiterData.calls || []

      const completedOrders = orders.filter(
        (order) => order.status === "completed"
      )

      const pendingOrders = orders.filter(
        (order) => order.status !== "completed"
      )

      const totalRevenue = completedOrders.reduce(
        (acc, order) => acc + order.totalAmount,
        0
      )

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalFoods: foods.length,
        waiterCalls: calls.length,
        pendingOrders: pendingOrders.length,
        completedOrders: completedOrders.length,
        recentOrders: orders.slice(0, 5),
        recentCalls: calls.slice(0, 5),
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
    const interval = setInterval(() => {
      fetchDashboard()
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c84b2f] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    )
  }

  // Essential Stats - Only 4 main cards
  const mainStats = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <FaShoppingCart />,
      change: "+12% from last month",
      color: "#c84b2f",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      change: "+18% from last month",
      color: "#e67e22",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: <FaClock />,
      change: `${stats.pendingOrders} active orders`,
      color: "#f39c12",
    },
    {
      title: "Waiter Calls",
      value: stats.waiterCalls,
      icon: <FaBell />,
      change: "needs attention",
      color: "#c84b2f",
    },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-0 md:px-2">
      {/* WELCOME SECTION */}
      <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Welcome Back, Admin 
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Here's what's happening with your restaurant today.
        </p>
      </div>

      {/* STATS CARDS - Light & Dark mode support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {mainStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {stat.title}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-2">
                  {stat.value}
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {stat.change}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
                style={{ backgroundColor: stat.color }}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          Quick Actions
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => navigate("/admin/foods")}
            className="bg-[#c84b2f] hover:bg-[#b03d24] text-white px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all shadow-sm"
          >
            + Add Food
          </button>
          <button
            onClick={() => navigate("/admin/categories")}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap hover:border-[#c84b2f] hover:text-[#c84b2f] dark:hover:text-[#c84b2f] transition-all"
          >
            + Add Category
          </button>
          <button
            onClick={() => navigate("/admin/qr-generator")}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap hover:border-[#c84b2f] hover:text-[#c84b2f] dark:hover:text-[#c84b2f] transition-all"
          >
            <FaQrcode className="inline mr-1" size={12} /> Generate QR
          </button>
          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap hover:border-[#c84b2f] hover:text-[#c84b2f] dark:hover:text-[#c84b2f] transition-all"
          >
            View All Orders
          </button>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT - Orders & Waiter Calls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white">
                Recent Orders
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Last 5 orders
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/orders")}
              className="text-[#c84b2f] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <FaArrowRight size={10} />
            </button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {stats.recentOrders.length === 0 ? (
              <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                No orders yet
              </div>
            ) : (
              stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="px-5 py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      Table #{order.tableNumber}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      order.status === "completed"
                        ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {order.status === "completed" ? (
                      <>
                        <FaCheckCircle className="inline mr-1" size={10} />{" "}
                        Completed
                      </>
                    ) : (
                      <>
                        <FaClock className="inline mr-1" size={10} />{" "}
                        {order.status}
                      </>
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Waiter Calls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white">
                Waiter Calls
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Active requests
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/waiter-calls")}
              className="text-[#c84b2f] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <FaArrowRight size={10} />
            </button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {stats.recentCalls.length === 0 ? (
              <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                No active waiter calls
              </div>
            ) : (
              stats.recentCalls.map((call) => (
                <div
                  key={call._id}
                  className="px-5 py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {call.customerName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Table #{call.tableNumber}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      call.status === "completed"
                        ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "bg-[#c84b2f]/10 dark:bg-[#c84b2f]/20 text-[#c84b2f] animate-pulse"
                    }`}
                  >
                    {call.status === "completed" ? (
                      "Resolved"
                    ) : (
                      "🛎️ Calling"
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RESTAURANT INFO - Status row with dark mode */}
      <div className="bg-gradient-to-r from-[#c84b2f]/5 to-transparent dark:from-[#c84b2f]/10 rounded-2xl p-4 border border-[#c84b2f]/10 dark:border-[#c84b2f]/20">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              System Online
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FaUtensils
              className="text-[#c84b2f]"
              size={14}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {stats.totalFoods} Menu Items
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FaCheckCircle
              className="text-green-500"
              size={14}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {stats.completedOrders} Orders Completed
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard