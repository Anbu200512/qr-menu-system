import mongoose from "mongoose"

const waiterCallSchema =
  new mongoose.Schema(
    {
      customerName: {
        type: String,
        required: true,
      },

      tableNumber: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        default: "pending"
      },
    },
    {
      timestamps: true,
    }
  )

export default mongoose.model(
  "WaiterCall",
  waiterCallSchema
)