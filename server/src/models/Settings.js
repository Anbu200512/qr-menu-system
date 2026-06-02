import mongoose from "mongoose"

const settingsSchema =
  new mongoose.Schema(
    {
      autoDeleteDays: {
        type: Number,
        default: 7,
      },
    },
    {
      timestamps: true,
    }
  )

const Settings =
  mongoose.model(
    "Settings",
    settingsSchema
  )

export default Settings