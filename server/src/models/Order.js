const mongoose = require("mongoose")

const orderSchema =
  new mongoose.Schema(
    {

      customerSessionId: {
        type: String,
        required: true,
      },

      orderId: {
  type: String,
  unique: true,
},

      customerName: {
        type: String,
        required: true,
      },

      tableNumber: {
        type: String,
        required: true,
      },

      items: [
        {
          food: {
            type:
              mongoose.Schema.Types
                .ObjectId,

            ref: "Food",
          },

          name: String,

          price: Number,

          quantity: Number,

          image: String,
        },
      ],

      totalAmount: {
        type: Number,
        required: true,
      },

      status: {
        type: String,

        enum: [
          "pending",
          "accepted",
          "preparing",
          "completed",
          "cancelled",
        ],

        default: "pending",
      },
    },

    {
      timestamps: true,
    }
  )

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  )