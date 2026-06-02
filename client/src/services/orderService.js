import axios from "axios"

const API = `${import.meta.env.VITE_API_URL}/api/orders`
// GET ORDERS
export const getOrders =
  async () => {

    const { data } =
      await axios.get(API)

    return data
  }

// CREATE ORDER
export const createOrder =
  async (orderData) => {

    const { data } =
      await axios.post(
        API,
        orderData
      )

    return data
  }

// UPDATE STATUS
export const updateOrderStatus =
  async (id, status) => {

    const { data } =
      await axios.put(
        `${API}/${id}/status`,
        { status }
      )

    return data
  }

// DELETE ORDER
export const deleteOrder =
  async (id) => {

    const { data } =
      await axios.delete(
        `${API}/${id}`
      )

    return data
  }

// DELETE BETWEEN DATES
export const deleteOrdersBetweenDates =
  async (
    startDate,
    endDate
  ) => {

    const { data } =
      await axios.post(
        `${API}/delete-between-dates`,
        {
          startDate,
          endDate,
        }
      )

    return data
  }

// AUTO DELETE
export const autoDeleteOrders =
  async () => {

    const { data } =
      await axios.delete(
        `${API}/auto-delete`
      )

    return data
  }

// UPDATE SETTINGS
export const updateAutoDeleteSettings =
  async (days) => {

    const { data } =
      await axios.put(
        `${API}/settings/auto-delete`,
        { days }
      )

    return data
  }

// GET SETTINGS
export const getAutoDeleteSettings =
  async () => {

    const { data } =
      await axios.get(
        `${API}/settings/auto-delete`
      )

    return data
  }