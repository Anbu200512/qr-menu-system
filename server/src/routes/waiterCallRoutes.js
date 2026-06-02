import express from "express"

import {
  createWaiterCall,
  getWaiterCalls,
  updateWaiterCallStatus,
  deleteWaiterCall,
  deleteWaiterCallsBetweenDates,
  autoDeleteWaiterCalls,
  updateWaiterCallSettings,
  getWaiterCallSettings,
} from "../controllers/waiterCallController.js"

const router = express.Router()

// CREATE CALL
router.post(
  "/",
  createWaiterCall
)

// GET ALL CALLS
router.get(
  "/",
  getWaiterCalls
)

// DELETE BETWEEN DATES
router.delete(
  "/delete-between-dates",
  deleteWaiterCallsBetweenDates
)

// AUTO DELETE
router.delete(
  "/auto-delete",
  autoDeleteWaiterCalls
)

// UPDATE SETTINGS
router.put(
  "/settings/auto-delete",
  updateWaiterCallSettings
)

// GET SETTINGS
router.get(
  "/settings/auto-delete",
  getWaiterCallSettings
)

// UPDATE STATUS
router.put(
  "/:id",
  updateWaiterCallStatus
)

// DELETE SINGLE
router.delete(
  "/:id",
  deleteWaiterCall
)

export default router