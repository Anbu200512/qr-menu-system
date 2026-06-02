import {
  useEffect,
  useState,
} from "react"

import toast from "react-hot-toast"

import {
  getWaiterCalls,
  updateWaiterCallStatus,
  deleteWaiterCall,
  deleteWaiterCallsBetweenDates,
  autoDeleteWaiterCalls,
  updateWaiterCallSettings,
  getWaiterCallSettings,
} from "../../services/waiterCallService"

import {
  FaSearch,
  FaFilter,
  FaSort,
  FaTrash,
  FaBell,
  FaCheck,
  FaClock,
  FaUser,
  FaTable,
  FaCalendarAlt,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa"

function WaiterCalls() {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("latest")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [autoDeleteDays, setAutoDeleteDays] = useState(7)
  const [currentPage, setCurrentPage] = useState(1)
  const callsPerPage = 6

  // FETCH CALLS
  const fetchCalls = async () => {
    try {
      const data = await getWaiterCalls()
      setCalls(data?.calls || [])
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch waiter calls")
    } finally {
      setLoading(false)
    }
  }

  // FETCH SETTINGS
  const fetchSettings = async () => {
    try {
      const data = await getWaiterCallSettings()
      if (data.settings) {
        setAutoDeleteDays(data.settings.autoDeleteDays)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // LOAD
  useEffect(() => {
    fetchCalls()
    fetchSettings()
    const interval = setInterval(() => {
      fetchCalls()
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // UPDATE STATUS
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateWaiterCallStatus(id, status)
      toast.success("Call status updated")
      fetchCalls()
    } catch (error) {
      toast.error("Status update failed")
    }
  }

  // DELETE SINGLE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this waiter call?")
    if (!confirmDelete) return
    try {
      await deleteWaiterCall(id)
      toast.success("Waiter call deleted")
      fetchCalls()
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  // DELETE BETWEEN DATES
  const handleDeleteBetweenDates = async () => {
    if (!startDate || !endDate) {
      return toast.error("Select dates")
    }
    const confirmDelete = window.confirm(
      `Delete waiter calls between ${startDate} and ${endDate}?`
    )
    if (!confirmDelete) return
    try {
      const data = await deleteWaiterCallsBetweenDates(startDate, endDate)
      toast.success(`${data.deletedCount} calls deleted`)
      fetchCalls()
    } catch (error) {
      console.log(error)
      toast.error("Delete failed")
    }
  }

  // AUTO DELETE
  const handleAutoDelete = async () => {
    try {
      const data = await autoDeleteWaiterCalls()
      toast.success(`${data.deletedCount} calls deleted`)
      fetchCalls()
    } catch (error) {
      toast.error("Auto delete failed")
    }
  }

  // SAVE SETTINGS
  const handleUpdateSettings = async () => {
    try {
      await updateWaiterCallSettings(autoDeleteDays)
      toast.success("Settings updated")
    } catch (error) {
      toast.error("Update failed")
    }
  }

  // FILTER + SORT
  const filteredCalls = (calls || [])
  .filter((call) => {
      const matchesSearch =
        call.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        call.tableNumber?.toString().includes(search)
      const matchesStatus = statusFilter === "all" ? true : call.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt)
      }
      return 0
    })

  // PAGINATION
  const totalPages = Math.ceil(filteredCalls.length / callsPerPage)
  const startIndex = (currentPage - 1) * callsPerPage
  const currentCalls = filteredCalls.slice(startIndex, startIndex + callsPerPage)

  // STATUS COLORS
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
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
      case "completed":
        return <FaCheck size={10} />
      default:
        return null
    }
  }

  // LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c84b2f] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
            Loading Waiter Calls...
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
          Waiter Calls 
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Manage customer waiter assistance requests
        </p>
      </div>

      {/* STATS ROW */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div className="bg-[#c84b2f]/10 dark:bg-[#c84b2f]/20 text-[#c84b2f] px-4 py-2 rounded-full text-sm font-medium">
          Total Calls: {filteredCalls.length}
        </div>
        <button
          onClick={handleAutoDelete}
          className="text-red-500 text-sm hover:text-red-600 font-medium"
        >
          🗑️ Auto Delete Completed Calls
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
              placeholder="Search by customer name or table..."
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
            <option value="completed">Completed</option>
          </select>

          {/* SORT */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 outline-none focus:border-[#c84b2f] text-gray-700 dark:text-gray-300 text-sm"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
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

      {/* DESKTOP TABLE */}
      <div className="hidden xl:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-900/50 px-5 py-3 border-b border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Table</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Time</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {currentCalls.map((call) => (
          <div
            key={call._id}
            className="grid grid-cols-12 items-center px-5 py-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
          >
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <FaUser className="text-gray-400" size={14} />
                <span className="font-medium text-gray-800 dark:text-white">{call.customerName}</span>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <FaTable className="text-gray-400" size={14} />
                <span className="text-gray-600 dark:text-gray-400">#{call.tableNumber}</span>
              </div>
            </div>
            <div className="col-span-2">
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(call.status)}`}
              >
                {getStatusIcon(call.status)} {call.status}
              </span>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" size={12} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(call.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="col-span-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(call.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <select
                value={call.status}
                onChange={(e) => handleStatusUpdate(call._id, e.target.value)}
                className="bg-gray-100 dark:bg-gray-700 border-none rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-[#c84b2f]"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => handleDelete(call._id)}
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
        {currentCalls.map((call) => (
          <div
            key={call._id}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaBell className="text-[#c84b2f]" size={14} />
                  <p className="font-semibold text-gray-800 dark:text-white">{call.customerName}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Table #{call.tableNumber}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(call.status)}`}
              >
                {getStatusIcon(call.status)} {call.status}
              </span>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              {new Date(call.createdAt).toLocaleDateString()} • {new Date(call.createdAt).toLocaleTimeString()}
            </div>
            <div className="flex gap-2">
              <select
                value={call.status}
                onChange={(e) => handleStatusUpdate(call._id, e.target.value)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#c84b2f]"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => handleDelete(call._id)}
                className="bg-red-500/10 text-red-500 px-3 py-2 rounded-xl text-sm"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {currentCalls.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
          <div className="text-6xl mb-4">🔔</div>
          <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">
            No Waiter Calls Found
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
    </div>
  )
}

export default WaiterCalls