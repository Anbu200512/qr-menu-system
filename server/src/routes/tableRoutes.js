import express from "express"

import {
  createTable,
  getTables,
  updateTableStatus,
  deleteTable,
} from "../controllers/tableController.js"

const router = express.Router()

// CREATE
router.post(
  "/",
  createTable
)

// GET
router.get(
  "/",
  getTables
)

// UPDATE STATUS
router.put(
  "/:id",
  updateTableStatus
)

// DELETE
router.delete(
  "/:id",
  deleteTable
)

export default router