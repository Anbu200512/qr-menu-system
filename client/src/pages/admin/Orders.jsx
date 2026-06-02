import {
  useEffect,
  useState,
} from "react"

import toast from "react-hot-toast"

import notificationSound from "../../assets/notification.mp3"

import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  deleteOrdersBetweenDates,
  autoDeleteOrders,
  updateAutoDeleteSettings,
  getAutoDeleteSettings,
} from "../../services/orderService"

import {
  FaSearch,
  FaFilter,
  FaSort,
  FaTrash,
  FaPrint,
  FaEye,
  FaCheck,
  FaClock,
  FaUtensils,
  FaCalendarAlt,
} from "react-icons/fa"

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("latest")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [autoDeleteDays, setAutoDeleteDays] = useState(7)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [combinedOrders, setCombinedOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const ordersPerPage = 8

  // FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const data = await getOrders()

console.log("ORDERS DATA", data)

setOrders(data?.orders || [])
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  // FETCH SETTINGS
  const fetchSettings = async () => {
    try {
      const data = await getAutoDeleteSettings()
      if (data.settings) {
        setAutoDeleteDays(data.settings.autoDeleteDays)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchSettings()
    const interval = setInterval(() => {
      fetchOrders()
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // UPDATE STATUS
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOrderStatus(id, status)
      toast.success("Order status updated")
      fetchOrders()
    } catch (error) {
      toast.error("Status update failed")
    }
  }

  // DELETE SINGLE
  const handleDeleteOrder = async (id) => {
    const confirmDelete = window.confirm("Delete this order?")
    if (!confirmDelete) return
    try {
      await deleteOrder(id)
      toast.success("Order deleted")
      fetchOrders()
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  // DELETE BETWEEN DATES
  const handleDeleteBetweenDates = async () => {
    if (!startDate || !endDate) {
      return toast.error("Select dates")
    }
    try {
      const data = await deleteOrdersBetweenDates(startDate, endDate)
      toast.success(`${data.deletedCount} orders deleted`)
      fetchOrders()
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  // AUTO DELETE
  const handleAutoDelete = async () => {
    try {
      const data = await autoDeleteOrders()
      toast.success(`${data.deletedCount} completed orders deleted`)
      fetchOrders()
    } catch (error) {
      toast.error("Auto delete failed")
    }
  }

  // SAVE SETTINGS
  const handleUpdateSettings = async () => {
    try {
      await updateAutoDeleteSettings(autoDeleteDays)
      toast.success("Settings updated")
    } catch (error) {
      toast.error("Update failed")
    }
  }

  // FILTER + SORT
  const filteredOrders = (orders || [])
  .filter((order) => {
      const matchesSearch =
        order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        order.tableNumber?.toString().includes(search) ||
        order.orderId?.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt)
      }
      if (sortBy === "high") {
        return b.totalAmount - a.totalAmount
      }
      if (sortBy === "low") {
        return a.totalAmount - b.totalAmount
      }
      return 0
    })

  // PAGINATION
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const startIndex = (currentPage - 1) * ordersPerPage
  const currentOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage)

  // STATUS COLORS
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
      case "preparing":
        return "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      case "completed":
        return "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock size={10} />
      case "preparing":
        return <FaUtensils size={10} />
      case "completed":
        return <FaCheck size={10} />
      default:
        return null
    }
  }

  // OPEN COMBINED BILL
  const handleViewBill = (order) => {
    const customerOrders = orders.filter(
      (o) => o.customerSessionId === order.customerSessionId
    )
    setCombinedOrders(customerOrders)
    setSelectedOrder(order)
  }

  const grandTotal = combinedOrders.reduce((total, order) => total + order.totalAmount, 0)

  // PRINT BILL
  const handlePrintBill = () => {
    const printContent = document.getElementById("bill-print").innerHTML
    const printWindow = window.open("", "", "width=800,height=600")
    printWindow.document.write(`
      <html>
      <head>
        <title>Print Bill</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .bill-header { text-align: center; margin-bottom: 20px; }
          .bill-items { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .bill-items th, .bill-items td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 15px; }
          @media print {
            body { margin: 0; padding: 10px; }
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  // LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c84b2f] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
            Loading Orders...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-0 md:px-2">
      {/* HEADER */}
      <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Orders
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Manage and track restaurant orders
        </p>
      </div>

      {/* STATS ROW */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div className="bg-[#c84b2f]/10 dark:bg-[#c84b2f]/20 text-[#c84b2f] px-4 py-2 rounded-full text-sm font-medium">
          Total Orders: {filteredOrders.length}
        </div>
        <button
          onClick={handleAutoDelete}
          className="text-red-500 text-sm hover:text-red-600 font-medium"
        >
          🗑️ Auto Delete Completed Orders
        </button>
      </div>

      {/* FILTERS SECTION */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* SEARCH */}
          <div className="flex-1 min-w-[200px] relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search by name, table or order ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#c84b2f] transition-all text-gray-800 dark:text-white placeholder-gray-400 text-sm"
            />
          </div>

          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 outline-none focus:border-[#c84b2f] text-gray-700 dark:text-gray-300 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="completed">Completed</option>
          </select>

          {/* SORT */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 outline-none focus:border-[#c84b2f] text-gray-700 dark:text-gray-300 text-sm"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="high">Highest Amount</option>
            <option value="low">Lowest Amount</option>
          </select>
        </div>

        {/* DATE RANGE DELETE */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 outline-none focus:border-[#c84b2f] text-gray-700 dark:text-gray-300 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 outline-none focus:border-[#c84b2f] text-gray-700 dark:text-gray-300 text-sm"
            />
          </div>
          <button
            onClick={handleDeleteBetweenDates}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-medium text-sm transition-all"
          >
            Delete Range
          </button>
          <div className="flex gap-2">
            <select
              value={autoDeleteDays}
              onChange={(e) => setAutoDeleteDays(Number(e.target.value))}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 outline-none text-gray-700 dark:text-gray-300 text-sm"
            >
              <option value={7}>7 Days</option>
              <option value={15}>15 Days</option>
              <option value={30}>30 Days</option>
            </select>
            <button
              onClick={handleUpdateSettings}
              className="bg-[#c84b2f] hover:bg-[#b03d24] text-white px-5 py-2 rounded-xl font-medium text-sm transition-all"
            >
              Save Auto-Delete
            </button>
          </div>
        </div>
      </div>

      {/* ORDERS TABLE - Desktop */}
      <div className="hidden xl:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-900/50 px-5 py-3 border-b border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          <div className="col-span-2">Order ID</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-1">Table</div>
          <div className="col-span-1">Items</div>
          <div className="col-span-1">Total</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {currentOrders.map((order) => (
          <div
            key={order._id}
            className="grid grid-cols-12 items-center px-5 py-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
          >
            <div className="col-span-2">
              <span className="font-mono text-sm font-semibold text-[#c84b2f]">{order.orderId}</span>
            </div>
            <div className="col-span-2">
              <p className="font-medium text-gray-800 dark:text-white">{order.customerName}</p>
            </div>
            <div className="col-span-1">
              <span className="text-gray-600 dark:text-gray-400">#{order.tableNumber}</span>
            </div>
            <div className="col-span-1">
              <span className="text-gray-600 dark:text-gray-400">{order.items.length}</span>
            </div>
            <div className="col-span-1">
              <span className="font-semibold text-[#c84b2f]">₹{order.totalAmount}</span>
            </div>
            <div className="col-span-2">
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(order.status)}`}
              >
                {getStatusIcon(order.status)} {order.status}
              </span>
            </div>
            <div className="col-span-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button
                onClick={() => handleViewBill(order)}
                className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                title="View Bill"
              >
                <FaEye size={16} />
              </button>
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                className="bg-gray-100 dark:bg-gray-700 border-none rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-[#c84b2f]"
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => handleDeleteOrder(order._id)}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                title="Delete"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
        {currentOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-mono text-sm font-bold text-[#c84b2f]">{order.orderId}</p>
                <p className="font-semibold text-gray-800 dark:text-white mt-1">{order.customerName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Table #{order.tableNumber}</p>
              </div>
              <span className="font-bold text-lg text-[#c84b2f]">₹{order.totalAmount}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)} {order.status}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {order.items.length} items
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleViewBill(order)}
                className="flex-1 bg-blue-500/10 text-blue-500 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1"
              >
                <FaEye size={12} /> Bill
              </button>
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl px-2 py-2 text-xs outline-none"
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => handleDeleteOrder(order._id)}
                className="bg-red-500/10 text-red-500 px-3 py-2 rounded-xl text-sm"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {currentOrders.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">
            No Orders Found
          </h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Try changing your search or filters
          </p>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#c84b2f] transition-all text-sm font-medium"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${
                currentPage === index + 1
                  ? "bg-[#c84b2f] text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#c84b2f]"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#c84b2f] transition-all text-sm font-medium"
          >
            Next
          </button>
        </div>
      )}

      {/* BILL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="bg-[#c84b2f] text-white px-6 py-4 text-center">
              <h2 className="text-2xl font-bold">ORDER RECEIPT</h2>
              <p className="text-white/80 text-sm mt-1">Restaurant Bill</p>
            </div>

            <div id="bill-print" className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Customer:</span>
                  <span className="text-gray-800 dark:text-white">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Table:</span>
                  <span className="text-gray-800 dark:text-white">#{selectedOrder.tableNumber}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="text-gray-800 dark:text-white">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3">Ordered Items</h3>
                {combinedOrders.map((order) => (
                  <div key={order._id} className="mb-4">
                    <p className="text-xs font-mono text-[#c84b2f] mb-2">{order.orderId}</p>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-white">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold text-[#c84b2f]">
                  <span>Total Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3">
              <button
                onClick={handlePrintBill}
                className="flex-1 bg-[#c84b2f] hover:bg-[#b03d24] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <FaPrint size={14} /> Print Bill
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders