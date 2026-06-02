import api from "./api"

// GET FOODS
export const getFoods =
  async () => {
    const response =
      await api.get("/foods")

    return response.data
  }

// CREATE FOOD
export const createFood =
  async (formData) => {
    const response =
      await api.post(
        "/foods",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      )

    return response.data
  }

// UPDATE FOOD
export const updateFood =
  async (
    id,
    formData
  ) => {
    const response =
      await api.put(
        `/foods/${id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      )

    return response.data
  }

// DELETE FOOD
export const deleteFood =
  async (id) => {
    const response =
      await api.delete(
        `/foods/${id}`
      )

    return response.data
  }