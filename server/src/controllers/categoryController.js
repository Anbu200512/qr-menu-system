import Category from "../models/Category.js"
import Food from "../models/Food.js"

// GET CATEGORIES
export const getCategories =
  async (req, res) => {
    try {
      const categories =
        await Category.find()

      const categoriesWithCount =
        await Promise.all(
          categories.map(
            async (category) => {
              const foodsCount =
                await Food.countDocuments(
                  {
                    category:
                      category._id,
                  }
                )

              return {
                ...category.toObject(),
                foodsCount,
              }
            }
          )
        )

      res.json({
        success: true,
        categories:
          categoriesWithCount,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    console.log("🔥 CATEGORY CONTROLLER HIT")
    console.log("BODY:", req.body)
    console.log("CATEGORY MODEL:", Category.modelName)

    const category = await Category.create({
      name: req.body.name,
    })

    res.status(201).json({
      success: true,
      category,
    })
  } catch (error) {
    console.log("🔥 FULL CATEGORY ERROR")
    console.log(error)

    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// UPDATE CATEGORY
export const updateCategory =
  async (req, res) => {
    try {
      const category =
        await Category.findById(
          req.params.id
        )

      if (!category) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Category not found",
          })
      }

      category.name =
        req.body.name

      await category.save()

      res.json({
        success: true,
        category,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// DELETE CATEGORY
export const deleteCategory =
  async (req, res) => {
    try {
      const category =
        await Category.findById(
          req.params.id
        )

      if (!category) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Category not found",
          })
      }

      await category.deleteOne()

      res.json({
        success: true,
        message:
          "Category deleted",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }