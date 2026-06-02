import multer from "multer"

// STORAGE
const storage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(null, "uploads/")
    },

    filename: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        Date.now() +
          "-" +
          file.originalname
      )
    },
  })

// FILE FILTER
const fileFilter = (
  req,
  file,
  cb
) => {
  if (
    file.mimetype.startsWith(
      "image"
    )
  ) {
    cb(null, true)
  } else {
    cb(
      new Error(
        "Only image files allowed"
      ),
      false
    )
  }
}

// EXPORT
const upload = multer({
  storage,
  fileFilter,
})

export default upload