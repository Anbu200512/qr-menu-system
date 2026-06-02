import {
  useEffect,
  useState,
} from "react"

import {
  getRevenue,
} from "../../services/revenueService"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

import {
  FaRupeeSign,
  FaCalendarDay,
  FaCalendarAlt,
  FaChartLine,
  FaShoppingCart,
} from "react-icons/fa"

function Revenue() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchRevenue = async () => {
    try {
      const res = await getRevenue()
      setData(res)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRevenue()
    const interval = setInterval(() => {
      fetchRevenue()
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c84b2f] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
            Loading Revenue Data...
          </p>
        </div>
      </div>
    )
  }

  const revenueCards = [
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue?.toLocaleString() || 0}`,
      icon: <FaRupeeSign />,
      change: "All time",
    },
    {
      title: "Today's Revenue",
      value: `₹${data.todayRevenue?.toLocaleString() || 0}`,
      icon: <FaCalendarDay />,
      change: "Last 24 hours",
    },
    {
      title: "This Month",
      value: `₹${data.monthRevenue?.toLocaleString() || 0}`,
      icon: <FaCalendarAlt />,
      change: "Current month",
    },
    {
      title: "This Year",
      value: `₹${data.yearRevenue?.toLocaleString() || 0}`,
      icon: <FaChartLine />,
      change: "Current year",
    },
    {
      title: "Completed Orders",
      value: data.totalOrders || 0,
      icon: <FaShoppingCart />,
      change: "Total orders done",
    },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-0 md:px-2">
      {/* HEADER */}
      <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Revenue Analytics 
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Track your restaurant's financial performance
        </p>
      </div>

      {/* REVENUE CARDS - Clean & Professional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {revenueCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 dark:text-gray-500 text-xs font-medium uppercase tracking-wide">
                  {card.title}
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mt-2">
                  {card.value}
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {card.change}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#c84b2f]/10 dark:bg-[#c84b2f]/20 flex items-center justify-center text-[#c84b2f] text-lg">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHART SECTION */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Revenue Trend
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Daily revenue breakdown
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#c84b2f]"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Revenue (₹)
            </span>
          </div>
        </div>

        <div className="w-full h-[380px] md:h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.chartData || []}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-gray-700"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickLine={{ stroke: "#6b7280" }}
                axisLine={{ stroke: "#9ca3af" }}
                className="dark:[&_tspan]:fill-gray-400"
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickLine={{ stroke: "#6b7280" }}
                axisLine={{ stroke: "#9ca3af" }}
                className="dark:[&_tspan]:fill-gray-400"
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e5e7eb",
                  borderRadius: "12px",
                  padding: "8px 12px",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#c84b2f" }}
                labelStyle={{ color: "#374151", fontWeight: "bold" }}
                formatter={(value) => [`₹${value}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#c84b2f"
                strokeWidth={3}
                dot={{ fill: "#c84b2f", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#c84b2f" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* QUICK INSIGHT - Simple footer */}
      <div className="mt-6 bg-gradient-to-r from-[#c84b2f]/5 to-transparent dark:from-[#c84b2f]/10 rounded-2xl p-4 border border-[#c84b2f]/10 dark:border-[#c84b2f]/20">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            📈 Last updated in real-time
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            💰 All values are in Indian Rupees (₹)
          </span>
        </div>
      </div>
    </div>
  )
}

export default Revenue