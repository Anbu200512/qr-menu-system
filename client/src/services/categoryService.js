import axios from "axios"

const API = `${import.meta.env.VITE_API_URL}/api/categories`

// GET
export const getCategories =
  async () => {
    const response =
      await axios.get(API)

    return response.data
  }

// CREATE
export const createCategory =
  async (categoryData) => {
    const response =
      await axios.post(
        API,
        categoryData
      )

    return response.data
  }

// UPDATE
export const updateCategory =
  async (
    id,
    categoryData
  ) => {
    const response =
      await axios.put(
        `${API}/${id}`,
        categoryData
      )

    return response.data
  }

// DELETE
export const deleteCategory =
  async (id) => {
    const response =
      await axios.delete(
        `${API}/${id}`
      )

    return response.data
  }