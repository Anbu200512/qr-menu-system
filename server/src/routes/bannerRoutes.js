import express from "express"

import {
  getBanners,
  createBanner,
  deleteBanner,
  updateBanner,
} from "../controllers/bannerController.js"

import upload from "../middleware/uploadMiddleware.js"

const router = express.Router()

router.get("/", getBanners)

router.post(
  "/",
  upload.single("image"),
  createBanner
)

router.delete(
  "/:id",
  deleteBanner
)

router.put(
  "/:id",
  upload.single("image"),
  updateBanner
)

export default router