import api from "./api"

// CREATE WAITER CALL
export const createWaiterCall =
  async (callData) => {
    const response =
      await api.post(
        "/waiter-calls",
        callData
      )

    return response.data
  }

// GET CALLS
export const getWaiterCalls =
  async () => {
    const response =
      await api.get(
        "/waiter-calls"
      )

    return response.data
  }

// UPDATE STATUS
export const updateWaiterCallStatus =
  async (
    id,
    status
  ) => {
    const response =
      await api.put(
        `/waiter-calls/${id}`,
        { status }
      )

    return response.data
  }

// DELETE SINGLE
export const deleteWaiterCall =
  async (id) => {
    const response =
      await api.delete(
        `/waiter-calls/${id}`
      )

    return response.data
  }

// DELETE BETWEEN DATES
export const deleteWaiterCallsBetweenDates =
  async (
    startDate,
    endDate
  ) => {
    const response =
      await api.delete(
        "/waiter-calls/delete-between-dates",
        {
          data: {
            startDate,
            endDate,
          },
        }
      )

    return response.data
  }

// AUTO DELETE
export const autoDeleteWaiterCalls =
  async () => {
    const response =
      await api.delete(
        "/waiter-calls/auto-delete"
      )

    return response.data
  }

// UPDATE SETTINGS
export const updateWaiterCallSettings =
  async (days) => {
    const response =
      await api.put(
        "/waiter-calls/settings/auto-delete",
        { days }
      )

    return response.data
  }

// GET SETTINGS
export const getWaiterCallSettings =
  async () => {
    const response =
      await api.get(
        "/waiter-calls/settings/auto-delete"
      )

    return response.data
  }