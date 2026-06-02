import express from "express"

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js"

const router = express.Router()

// GET ALL
router.get(
  "/",
  getCategories
)

// CREATE
router.post(
  "/",
  createCategory
)

// UPDATE
router.put(
  "/:id",
  updateCategory
)

// DELETE
router.delete(
  "/:id",
  deleteCategory
)

export default router