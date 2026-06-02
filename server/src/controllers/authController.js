const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return res.status(200).json({
        _id: "123456",
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        isAdmin: true,
        token: process.env.JWT_SECRET || "admin_token",
      })
    }

    return res.status(401).json({
      message: "Invalid email or password",
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  loginUser,
}