import axios from "axios"

const API =
  " import.meta.env.VITE_API_URL/api/revenue"

export const getRevenue =
  async () => {
    const { data } =
      await axios.get(API)

    return data
  }