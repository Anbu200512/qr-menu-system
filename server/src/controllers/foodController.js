import Food from "../models/Food.js"




// GET ALL FOODS
export const getFoods = async (
  req,
  res
) => {
  try {
    const foods =
  await Food.find()
    .populate("category")
    .sort({
      createdAt: -1,
    })
    .lean()



    res.status(200).json({
      success: true,
      foods,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    })
  }
}

// GET SINGLE FOOD
export const getFoodById =
  async (req, res) => {
    try {
      const food =
        await Food.findById(
          req.params.id
        ).populate(
          "category"
        )

      if (!food) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Food not found",
          })
      }

      res.status(200).json({
        success: true,
        food,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// CREATE FOOD
export const createFood =
  async (req, res) => {
    try {


      const {
        name,
        price,
        description,
        category,
        isVeg,
        isPopular,
      } = req.body

      // VALIDATION
      if (
        !name ||
        !price ||
        !description ||
        !category
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        })
      }

      // IMAGE CHECK
      if (!req.file) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Food image is required",
          })
      }

      // IMAGE PATH
      const imagePath =
  req.file.path

      const food =
        await Food.create({
          name,
          price,
          description,
          category,
          image:
            imagePath,

          isVeg:
            isVeg ===
            "true",

          isPopular:
            isPopular ===
            "true",
        })

      const populatedFood =
        await Food.findById(
          food._id
        ).populate(
          "category"
        )

      res.status(201).json({
        success: true,
        message:
          "Food added successfully",
        food:
          populatedFood,
      })
    } catch (error) {
      console.log(error)

      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// UPDATE FOOD
export const updateFood =
  async (req, res) => {
    try {
      const food =
        await Food.findById(
          req.params.id
        )

      if (!food) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Food not found",
          })
      }

      const {
        name,
        price,
        description,
        category,
        isVeg,
        isPopular,
      } = req.body

      food.name =
        name || food.name

      food.price =
        price || food.price

      food.description =
        description ||
        food.description

      food.category =
        category ||
        food.category

      food.isVeg =
        isVeg === "true"

      food.isPopular =
        isPopular ===
        "true"

      // UPDATE IMAGE
      if (req.file) {
        food.image =
  req.file.path
      }

      const updatedFood =
        await food.save()

      const populatedFood =
        await Food.findById(
          updatedFood._id
        ).populate(
          "category"
        )

      res.status(200).json({
        success: true,
        message:
          "Food updated successfully",
        food:
          populatedFood,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// DELETE FOOD
export const deleteFood =
  async (req, res) => {
    try {
      const food =
        await Food.findById(
          req.params.id
        )

      if (!food) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Food not found",
          })
      }

      await food.deleteOne()

      res.status(200).json({
        success: true,
        message:
          "Food deleted successfully",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }