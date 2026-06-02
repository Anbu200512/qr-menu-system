import Table from "../models/Table.js"

// CREATE TABLE
export const createTable =
  async (req, res) => {
    try {
      const {
        tableNumber,
      } = req.body

      const existing =
        await Table.findOne({
          tableNumber,
        })

      if (existing) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Table already exists",
          })
      }

      const qrCode = `${process.env.CLIENT_URL}/menu/table/${tableNumber}`

      const table =
        await Table.create({
          tableNumber,
          qrCode,
        })

      res.status(201).json({
        success: true,
        table,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// GET TABLES
export const getTables =
  async (req, res) => {
    try {
      const tables =
        await Table.find().sort({
          tableNumber: 1,
        })

      res.json({
        success: true,
        tables,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// UPDATE STATUS
export const updateTableStatus =
  async (req, res) => {
    try {
      const table =
        await Table.findById(
          req.params.id
        )

      if (!table) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Table not found",
          })
      }

      table.status =
        req.body.status

      await table.save()

      res.json({
        success: true,
        table,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// DELETE TABLE
export const deleteTable =
  async (req, res) => {
    try {
      const table =
        await Table.findById(
          req.params.id
        )

      if (!table) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Table not found",
          })
      }

      await table.deleteOne()

      res.json({
        success: true,
        message:
          "Table deleted",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }