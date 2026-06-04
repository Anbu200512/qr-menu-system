import axios from "axios"

const API =
  `${import.meta.env.VITE_API_URL}/api/advertisements`

// GET ALL
export const getAdvertisements =
  async () => {
    const response =
      await axios.get(API)

    return response.data
  }

// CREATE
export const createAdvertisement =
  async (
    advertisementData
  ) => {
    const response =
      await axios.post(
        API,
        advertisementData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      )

    return response.data
  }

// UPDATE
export const updateAdvertisement =
  async (
    id,
    advertisementData
  ) => {
    const response =
      await axios.put(
        `${API}/${id}`,
        advertisementData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      )

    return response.data
  }

// DELETE
export const deleteAdvertisement =
  async (id) => {
    const response =
      await axios.delete(
        `${API}/${id}`
      )

    return response.data
  }