import mongoose from "mongoose"

const advertisementSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
      },

      image: {
        type: String,
        required: true,
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