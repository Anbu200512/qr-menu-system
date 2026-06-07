import FoodCard from "./FoodCard"

function MenuGrid({
  foods,
  visibleItems,
  cart,
  favorites,
  addToCart,
  updateQuantity,
  toggleFavorite,
  setSelectedFilters,
  setSearch,
  setSelectedCategory,
  setVegFilter,
}) {
  const clearFilters = () => {
    setSelectedFilters({
      sortBy: "recommended",
      foodType: [],
      categories: [],
      priceRange: [],
      ratings: [],
      prepTime: [],
      spiceLevel: [],
      bestSellers: false,
      offers: false,
      availability: "all",
    })

    setSearch("")
    setSelectedCategory("All")
    setVegFilter("all")
  }

  return (
    <div className="fp-menu-section">
      <div className="fp-menu-head">
        <div
          className="fp-section-title"
          style={{ marginBottom: 0 }}
        >
          Our Menu
        </div>

        <span className="fp-menu-count">
          {foods.length} items
        </span>
      </div>

      {foods.length === 0 ? (
        <div className="fp-empty">
          <div className="fp-empty-emoji">
            😢
          </div>

          <p>No items match your filters</p>

          <button
            className="fp-empty-clear"
            onClick={clearFilters}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="fp-grid">
          {foods
            .slice(0, visibleItems)
            .map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                cart={cart}
                favorites={favorites}
                addToCart={addToCart}
                updateQuantity={updateQuantity}
                toggleFavorite={toggleFavorite}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default MenuGrid