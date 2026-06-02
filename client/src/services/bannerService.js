import axios from "axios"

const API = `${import.meta.env.VITE_API_URL}/api/banners`
// GET ALL BANNERS
export const getBanners =
  async () => {
    const response =
      await axios.get(API)

    return response.data
  }

// CREATE BANNER
export const createBanner =
  async (bannerData) => {
    const response =
      await axios.post(
        API,
        bannerData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      )

    return response.data
  }

// UPDATE BANNER
export const updateBanner =
  async (
    id,
    bannerData
  ) => {
    const response =
      await axios.put(
        `${API}/${id}`,
        bannerData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      )

    return response.data
  }

// DELETE BANNER
export const deleteBanner =
  async (id) => {
    const response =
      await axios.delete(
        `${API}/${id}`
      )

    return response.data
  }