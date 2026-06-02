import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import { createServer } from "http"
import { Server } from "socket.io"

import connectDB from "./config/db.js"

import foodRoutes from "./routes/foodRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import bannerRoutes from "./routes/bannerRoutes.js"
import waiterCallRoutes from "./routes/waiterCallRoutes.js"
import tableRoutes from "./routes/tableRoutes.js"
import revenueRoutes from "./routes/revenueRoutes.js"
dotenv.config()

// CONNECT DATABASE
connectDB()

const app = express()

// MIDDLEWARE
app.use(cors())

app.use(express.json())

app.use(
  express.urlencoded({
    extended: true,
  })
)

// STATIC UPLOADS
app.use(
  "/uploads",
  express.static("uploads")
)

// ROUTES
app.use(
  "/api/foods",
  foodRoutes
)

app.use(
  "/api/categories",
  categoryRoutes
)

app.use(
  "/api/orders",
  orderRoutes
)

app.use(
  "/api/auth",
  authRoutes
)

app.use(
  "/api/banners",
  bannerRoutes
)

app.use(
  "/api/waiter-calls",
  waiterCallRoutes
)

app.use(
  "/api/tables",
  tableRoutes
)

app.use(
  "/api/revenue",
  revenueRoutes
)

// TEST ROUTE
app.get("/", (req, res) => {
  res.send(
    "QR Menu System API Running 🚀"
  )
})

// SOCKET SERVER
const httpServer =
  createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },

  pingTimeout: 60000,
})

global.io = io

io.on("connection", (socket) => {
  console.log("User connected")

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })
})

// PORT
const PORT =
  process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  )
})