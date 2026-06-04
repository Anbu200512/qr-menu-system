import express from "express"

import {
  getAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
} from "../controllers/advertisementController.js"

import upload from "../middleware/uploadMiddleware.js"

const router = express.Router()

router.get(
  "/",
  getAdvertisements
)

router.post(
  "/",
  upload.single("image"),
  createAdvertisement
)

router.put(
  "/:id",
  upload.single("image"),
  updateAdvertisement
)

router.delete(
  "/:id",
  deleteAdvertisement
)

export default router