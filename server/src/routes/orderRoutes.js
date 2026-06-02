import express from "express"

const router =
  express.Router()

import {
  createOrder,
  getOrders,
  getOrderById,
  getOrderBySession,
  updateOrderStatus,
  deleteOrder,
  deleteOrdersBetweenDates,
  autoDeleteCompletedOrders,
  updateAutoDeleteSettings,
  getAutoDeleteSettings,
} from "../controllers/orderController.js"

// CREATE ORDER
router.post(
  "/",
  createOrder
)

// GET ALL ORDERS
router.get(
  "/",
  getOrders
)

// GET ORDER BY SESSION
router.get(
  "/session/:sessionId",
  getOrderBySession
)

// GET SINGLE ORDER
router.get(
  "/:id",
  getOrderById
)

// UPDATE STATUS
router.put(
  "/:id/status",
  updateOrderStatus
)

// DELETE ORDER
router.delete(
  "/:id",
  deleteOrder
)

// DELETE BETWEEN DATES
router.post(
  "/delete-between-dates",
  deleteOrdersBetweenDates
)

// AUTO DELETE
router.delete(
  "/auto-delete",
  autoDeleteCompletedOrders
)

// SETTINGS
router.put(
  "/settings/auto-delete",
  updateAutoDeleteSettings
)

router.get(
  "/settings/auto-delete",
  getAutoDeleteSettings
)

export default router