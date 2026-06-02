import Order from "../models/Order.js"

export const getRevenue =
  async (req, res) => {
    try {
      const completedOrders =
        await Order.find({
          status: "completed",
        })

      const totalRevenue =
        completedOrders.reduce(
          (acc, order) =>
            acc +
            order.totalAmount,
          0
        )

      const today =
        new Date()

      today.setHours(
        0,
        0,
        0,
        0
      )

      const todayOrders =
        completedOrders.filter(
          (order) =>
            new Date(
              order.createdAt
            ) >= today
        )

      const todayRevenue =
        todayOrders.reduce(
          (acc, order) =>
            acc +
            order.totalAmount,
          0
        )

      const month =
        new Date()

      month.setDate(1)

      month.setHours(
        0,
        0,
        0,
        0
      )

      const monthOrders =
        completedOrders.filter(
          (order) =>
            new Date(
              order.createdAt
            ) >= month
        )

      const monthRevenue =
        monthOrders.reduce(
          (acc, order) =>
            acc +
            order.totalAmount,
          0
        )

      const year =
        new Date()

      year.setMonth(0)

      year.setDate(1)

      year.setHours(
        0,
        0,
        0,
        0
      )

      const yearOrders =
        completedOrders.filter(
          (order) =>
            new Date(
              order.createdAt
            ) >= year
        )

      const yearRevenue =
        yearOrders.reduce(
          (acc, order) =>
            acc +
            order.totalAmount,
          0
        )

      const revenueByDate =
        {}

      completedOrders.forEach(
        (order) => {
          const date =
            new Date(
              order.createdAt
            ).toLocaleDateString()

          revenueByDate[
            date
          ] =
            (revenueByDate[
              date
            ] || 0) +
            order.totalAmount
        }
      )

      const chartData =
        Object.keys(
          revenueByDate
        ).map((date) => ({
          date,
          revenue:
            revenueByDate[
              date
            ],
        }))

      res.json({
        success: true,
        totalRevenue,
        todayRevenue,
        monthRevenue,
        yearRevenue,
        totalOrders:
          completedOrders.length,
        chartData,
      })
    } catch (error) {
      console.log(error)

      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }