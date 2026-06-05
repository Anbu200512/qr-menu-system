import Banner from "../models/Banner.js"

// GET ALL BANNERS
export const getBanners =
  async (req, res) => {
    try {
      const banners =
  await Banner.find()
    .sort({
      priority: 1,
      createdAt: -1,
    })

      res.json({
        success: true,
        banners,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// CREATE BANNER
// CREATE BANNER
export const createBanner =
  async (req, res) => {
    try {
      const {
        title,
        subtitle,
        priority,
      } = req.body

      const image =
        req.file
          ? req.file.path
          : ""

      const banner =
        await Banner.create({
          title,
          subtitle,

          // FIX BOOLEAN
          isActive:
  req.body.isActive ===
  "true",

priority:
  Number(priority) || 1,

          image,
        })

      res.status(201).json({
        success: true,
        banner,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// UPDATE BANNER
// UPDATE BANNER
export const updateBanner =
  async (req, res) => {
    try {
      const banner =
        await Banner.findById(
          req.params.id
        )

      if (!banner) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Banner not found",
          })
      }

      const {
        title,
        subtitle,
        priority,
      } = req.body

      banner.title = title

      banner.subtitle =
        subtitle

      // FIX BOOLEAN
     banner.isActive =
  req.body.isActive ===
  "true"

banner.priority =
  Number(priority) || 1

      // IMAGE
      if (req.file) {
        banner.image = req.file.path
      }

      await banner.save()

      res.json({
        success: true,
        banner,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// DELETE BANNER
export const deleteBanner =
  async (req, res) => {
    try {
      const banner =
        await Banner.findById(
          req.params.id
        )

      if (!banner) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Banner not found",
          })
      }

      await banner.deleteOne()

      res.json({
        success: true,
        message:
          "Banner deleted",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }