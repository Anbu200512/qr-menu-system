import Order from "../models/Order.js"
import Settings from "../models/Settings.js"

// CREATE ORDER
export const createOrder =
  async (req, res) => {

    try {

      console.log(
  "REQ BODY:",
  req.body
)

     const {
  customerSessionId,
  customerName,
  tableNumber,
  items,
  totalAmount,
} = req.body

const orderId =
  "ORD-" +
  Math.floor(
    Math.random() * 900000
  )

      // CREATE NEW ORDER
      const newOrder =
        new Order({
          orderId,
          customerSessionId,
          customerName,
          tableNumber,
          items,
          totalAmount,
          status: "pending",
        })

      await newOrder.save()

      res.status(201).json({
        success: true,
        message:
          "Order placed successfully",
        order: newOrder,
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

  

// GET ALL ORDERS
export const getOrders =
  async (req, res) => {

    try {

      const orders =
        await Order.find()
          .sort({
            createdAt: -1,
          })

      res.status(200).json({
        success: true,
        orders,
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

// GET SINGLE ORDER
export const getOrderById =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        )

      if (!order) {

        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        })
      }

      res.status(200).json({
        success: true,
        order,
      })

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// GET ORDER BY SESSION
export const getOrderBySession =
  async (req, res) => {

    try {

      console.log(
        "TRACK PARAM:",
        req.params.sessionId
      )

      const orders =
  await Order.find({

    customerSessionId:
      req.params.sessionId,

  }).sort({
    createdAt: -1,
  })

      console.log(
        "FOUND ORDERS:",
        orders
      )

      res.status(200).json({
        success: true,
        orders,
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

// UPDATE ORDER STATUS
export const updateOrderStatus =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        )

      if (!order) {

        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        })
      }

      order.status =
        req.body.status

      await order.save()

      res.status(200).json({
        success: true,
        message:
          "Order status updated",
        order,
      })

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// DELETE ORDER
export const deleteOrder =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        )

      if (!order) {

        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        })
      }

      await order.deleteOne()

      res.status(200).json({
        success: true,
        message:
          "Order deleted successfully",
      })

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// DELETE BETWEEN DATES
export const deleteOrdersBetweenDates =
  async (req, res) => {

    try {

      const {
        startDate,
        endDate,
      } = req.body

      if (
        !startDate ||
        !endDate
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Dates are required",
        })
      }

      const start =
        new Date(startDate)

      const end =
        new Date(endDate)

      end.setHours(
        23,
        59,
        59,
        999
      )

      const result =
        await Order.deleteMany({
          createdAt: {
            $gte: start,
            $lte: end,
          },
        })

      res.status(200).json({
        success: true,
        deletedCount:
          result.deletedCount,
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

// UPDATE AUTO DELETE SETTINGS
export const updateAutoDeleteSettings =
  async (req, res) => {

    try {

      const { days } =
        req.body

      let settings =
        await Settings.find()

      if (!settings) {

        settings =
          new Settings({
            autoDeleteDays:
              days,
          })

      } else {

        settings.autoDeleteDays =
          days
      }

      await settings.save()

      res.status(200).json({
        success: true,
        settings,
      })

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// AUTO DELETE COMPLETED ORDERS
export const autoDeleteCompletedOrders =
  async (req, res) => {

    try {

      const settings =
        await Settings.find()

      const days =
        settings?.autoDeleteDays || 7

      const date =
        new Date()

      date.setDate(
        date.getDate() - days
      )

      const result =
        await Order.deleteMany({
          status: "completed",

          createdAt: {
            $lte: date,
          },
        })

      res.status(200).json({
        success: true,
        deletedCount:
          result.deletedCount,
      })

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// GET SETTINGS
export const getAutoDeleteSettings =
  async (req, res) => {

    try {

      const settings =
        await Settings.find()

      res.status(200).json({
        success: true,
        settings,
      })

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }