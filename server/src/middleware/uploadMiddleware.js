import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.js"

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "qr-menu-system",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files allowed"), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
})

export default upload