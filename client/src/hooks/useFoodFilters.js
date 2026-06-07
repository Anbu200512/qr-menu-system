export default function useFoodFilters({
  displayFoods,
  search,
  selectedCategory,
  vegFilter,
  selectedFilters,
}) {
  const filteredFoods = (displayFoods || []).filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === "All" ||
      food.category?.name === selectedCategory

    let matchesVeg = true

    if (vegFilter === "veg") {
      matchesVeg = food.isVeg
    } else if (vegFilter === "nonveg") {
      matchesVeg = !food.isVeg
    }

    let matchesFoodType = true

    if (selectedFilters.foodType.length > 0) {
      matchesFoodType =
        selectedFilters.foodType.some((type) => {
          if (type === "veg") return food.isVeg
          if (type === "nonveg") return !food.isVeg
          return false
        })
    }

    let matchesPrice = true

    if (selectedFilters.priceRange.length > 0) {
      matchesPrice =
        selectedFilters.priceRange.some((range) => {
          if (range === "under100")
            return food.price < 100

          if (range === "100to250")
            return (
              food.price >= 100 &&
              food.price <= 250
            )

          if (range === "250to500")
            return (
              food.price > 250 &&
              food.price <= 500
            )

          if (range === "above500")
            return food.price > 500

          return false
        })
    }

    let matchesRating = true

    if (selectedFilters.ratings.length > 0) {
      matchesRating =
        selectedFilters.ratings.some((rating) => {
          if (rating === "above4")
            return (
              (food.rating || 4.5) >= 4
            )

          if (rating === "above3")
            return (
              (food.rating || 4.5) >= 3
            )

          return false
        })
    }

    let matchesPrepTime = true

    if (selectedFilters.prepTime.length > 0) {
      matchesPrepTime =
        selectedFilters.prepTime.some((time) => {
          if (time === "under20")
            return (
              (food.prepTime || 25) <= 20
            )

          if (time === "20to30")
            return (
              (food.prepTime || 25) >= 20 &&
              (food.prepTime || 25) <= 30
            )

          if (time === "above30")
            return (
              (food.prepTime || 25) > 30
            )

          return false
        })
    }

    let matchesSpice = true

    if (selectedFilters.spiceLevel.length > 0) {
      matchesSpice =
        selectedFilters.spiceLevel.includes(
          food.spiceLevel || "medium"
        )
    }

    let matchesBestSeller = true

    if (selectedFilters.bestSellers) {
      matchesBestSeller = food.isPopular
    }

    let matchesOffers = true

    if (selectedFilters.offers) {
      matchesOffers =
        food.hasOffer || false
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesVeg &&
      matchesFoodType &&
      matchesPrice &&
      matchesRating &&
      matchesPrepTime &&
      matchesSpice &&
      matchesBestSeller &&
      matchesOffers
    )
  })

  const getSortedFoods = () => {
    const sorted = [...filteredFoods]

    if (selectedFilters.sortBy === "priceLow") {
      sorted.sort(
        (a, b) => a.price - b.price
      )
    } else if (
      selectedFilters.sortBy === "priceHigh"
    ) {
      sorted.sort(
        (a, b) => b.price - a.price
      )
    } else if (
      selectedFilters.sortBy === "rating"
    ) {
      sorted.sort(
        (a, b) =>
          (b.rating || 4.5) -
          (a.rating || 4.5)
      )
    } else if (
      selectedFilters.sortBy === "popular"
    ) {
      sorted.sort(
        (a, b) =>
          (b.isPopular ? 1 : 0) -
          (a.isPopular ? 1 : 0)
      )
    } else if (
      selectedFilters.sortBy ===
      "fastServing"
    ) {
      sorted.sort(
        (a, b) =>
          (a.prepTime || 25) -
          (b.prepTime || 25)
      )
    }

    return sorted
  }

  const getActiveFiltersCount = () => {
    let count = 0

    count += selectedFilters.foodType.length
    count += selectedFilters.categories.length
    count += selectedFilters.priceRange.length
    count += selectedFilters.ratings.length
    count += selectedFilters.prepTime.length
    count += selectedFilters.spiceLevel.length

    if (selectedFilters.bestSellers) count++
    if (selectedFilters.offers) count++

    if (
      selectedFilters.sortBy !==
      "recommended"
    )
      count++

    return count
  }

  return {
    filteredFoods,
    getSortedFoods,
    getActiveFiltersCount,
  }
}