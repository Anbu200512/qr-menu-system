const QRCode = require("qrcode")

const Table = require("../models/Table")

// Generate QR
const generateQR = async (req, res) => {
  try {
    const { tableNumber } = req.body

    const menuURL = `http://localhost:5173/menu/table-${tableNumber}`

    const qrCode = await QRCode.toDataURL(menuURL)

    const table = await Table.create({
      tableNumber,
      qrCode,
    })

    res.status(201).json({
      success: true,
      table,
    })
  } catch (error) {
    res.status(500)
    throw new Error(error.message)
  }
}

module.exports = {
  generateQR,
}