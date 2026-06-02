import mongoose from "mongoose"

const bannerSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      subtitle: {
        type: String,
      },

      image: {
        type: String,
        required: true,
      },

      // FIX PRIORITY
      priority: {
        type: Number,
        default: 1,
      },

      // FIX ACTIVE
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  )

const Banner =
  mongoose.model(
    "Banner",
    bannerSchema
  )

export default Banner