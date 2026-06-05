import Advertisement from "../models/Advertisement.js"

// GET ALL ADVERTISEMENTS
export const getAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find()
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      advertisements,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// CREATE ADVERTISEMENT
export const createAdvertisement = async (req, res) => {
  try {

    console.log(req.body)
console.log(req.file)
    const {
      title,
      description,
    } = req.body

    const image = req.file
      ? req.file.path
      : ""

    const advertisement =
      await Advertisement.create({
        title,
        description,

        isActive:
          req.body.isActive ===
          "true",

        image,
      })

    res.status(201).json({
      success: true,
      advertisement,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// UPDATE ADVERTISEMENT
export const updateAdvertisement = async (req, res) => {
  try {
    const advertisement =
      await Advertisement.findById(
        req.params.id
      )

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message:
          "Advertisement not found",
      })
    }

    const {
      title,
      description,
    } = req.body

    advertisement.title = title
    advertisement.description =
      description

    advertisement.isActive =
      req.body.isActive ===
      "true"

    if (req.file) {
      advertisement.image =
        req.file.path
    }

    await advertisement.save()

    res.json({
      success: true,
      advertisement,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// DELETE ADVERTISEMENT
export const deleteAdvertisement = async (req, res) => {
  try {
    const advertisement =
      await Advertisement.findById(
        req.params.id
      )

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message:
          "Advertisement not found",
      })
    }

    await advertisement.deleteOne()

    res.json({
      success: true,
      message:
        "Advertisement deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}