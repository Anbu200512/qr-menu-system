const express = require("express")

const { generateQR } = require("../controllers/qrController")

const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/", protect, generateQR)

module.exports = router