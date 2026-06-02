import WaiterCall from "../models/WaiterCall.js"
import Settings from "../models/Settings.js"

// CREATE WAITER CALL
export const createWaiterCall =
  async (req, res) => {
    try {
      const call =
        await WaiterCall.create(
          req.body
        )

      res.status(201).json({
        success: true,
        call,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// GET ALL WAITER CALLS
export const getWaiterCalls =
  async (req, res) => {
    try {
      const calls =
        await WaiterCall.find().sort(
          {
            createdAt: -1,
          }
        )

      res.json({
        success: true,
        calls,
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
export const updateWaiterCallStatus =
  async (req, res) => {
    try {
      const call =
        await WaiterCall.findById(
          req.params.id
        )

      if (!call) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Call not found",
          })
      }

      call.status =
        req.body.status

      await call.save()

      res.json({
        success: true,
        call,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// DELETE SINGLE CALL
export const deleteWaiterCall =
  async (req, res) => {
    try {
      const call =
        await WaiterCall.findById(
          req.params.id
        )

      if (!call) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Call not found",
          })
      }

      await call.deleteOne()

      res.json({
        success: true,
        message:
          "Waiter call deleted",
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      })
    }
  }

// DELETE BETWEEN DATES
export const deleteWaiterCallsBetweenDates =
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } = req.body

      if (
        !startDate ||
        !endDate
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Dates required",
          })
      }

      const start =
        new Date(startDate)

      const end =
        new Date(endDate)

      end.setHours(
        23,
        59,
        59,
        999
      )

      const result =
        await WaiterCall.deleteMany({
          createdAt: {
            $gte: start,
            $lte: end,
          },
        })

      res.json({
        success: true,
        deletedCount:
          result.deletedCount,
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

// AUTO DELETE
export const autoDeleteWaiterCalls =
  async (req, res) => {
    try {
      const settings =
        await Settings.findOne()

      const days =
        settings?.autoDeleteDays || 7

      const deleteDate =
        new Date()

      deleteDate.setDate(
        deleteDate.getDate() -
          days
      )

      const result =
        await WaiterCall.deleteMany({
          status: "completed",

          createdAt: {
            $lte: deleteDate,
          },
        })

      res.json({
        success: true,
        deletedCount:
          result.deletedCount,
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

// UPDATE SETTINGS
export const updateWaiterCallSettings =
  async (req, res) => {
    try {
      const { days } =
        req.body

      let settings =
        await Settings.findOne()

      if (!settings) {
        settings =
          new Settings({
            autoDeleteDays:
              days,
          })
      } else {
        settings.autoDeleteDays =
          days
      }

      await settings.save()

      res.json({
        success: true,
        settings,
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

// GET SETTINGS
export const getWaiterCallSettings =
  async (req, res) => {
    try {
      const settings =
        await Settings.findOne()

      res.json({
        success: true,
        settings,
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