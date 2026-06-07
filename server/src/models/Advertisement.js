import mongoose from "mongoose"

const advertisementSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      description: String,

      image: {
        type: String,
        required: true,
      },

      link: String,

      ctaText: {
        type: String,
        default: "Learn More",
      },

      priority: {
        type: Number,
        default: 1,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  )

const Advertisement =
  mongoose.model(
    "Advertisement",
    advertisementSchema
  )

export default Advertisement