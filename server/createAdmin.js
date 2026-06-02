const mongoose = require("mongoose")

const User = require("./src/models/User")

mongoose.connect(
  "mongodb://127.0.0.1:27017/qr-menu-system"
)

const createAdmin = async () => {
  try {
    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: "admin123",
    })

    console.log(
      "Admin Created Successfully"
    )

    process.exit()
  } catch (error) {
    console.log(error)

    process.exit(1)
  }
}

createAdmin()