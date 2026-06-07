import { useEffect, useState } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export default function useMenuData() {
  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [banners, setBanners] = useState([])
  const [advertisements, setAdvertisements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          foodsRes,
          categoriesRes,
          bannersRes,
          adsRes,
        ] = await Promise.all([
          axios.get(`${API_URL}/api/foods`),
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/banners`),
          axios.get(`${API_URL}/api/advertisements`),
        ])

        setFoods(foodsRes.data.foods || [])
        setCategories(categoriesRes.data.categories || [])

        setBanners(
          (bannersRes.data.banners || [])
            .filter((banner) => banner.isActive)
            .sort((a, b) => a.priority - b.priority)
        )

        setAdvertisements(
          adsRes.data.advertisements || []
        )
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    foods,
    categories,
    banners,
    advertisements,
    loading,
  }
}