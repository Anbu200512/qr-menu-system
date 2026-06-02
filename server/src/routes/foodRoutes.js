import express from "express"

import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} from "../controllers/foodController.js"

import upload from "../middleware/uploadMiddleware.js"

const router =
  express.Router()

// GET ALL FOODS
router.get(
  "/",
  getFoods
)

// GET SINGLE FOOD
router.get(
  "/:id",
  getFoodById
)

// CREATE FOOD
router.post(
  "/",
  upload.single("image"),
  createFood
)

// UPDATE FOOD
router.put(
  "/:id",
  upload.single("image"),
  updateFood
)

// DELETE FOOD
router.delete(
  "/:id",
  deleteFood
)

export default router