import mongoose from "mongoose"

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    qrCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

const Table = mongoose.model(
  "Table",
  tableSchema
)

export default Table