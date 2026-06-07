import { Filter } from "lucide-react"

function DesktopFilters({
  selectedFilters,
  setSelectedFilters,
  activeFilterSection,
  setActiveFilterSection,
  selectedCategory,
  setSelectedCategory,
  categories,
  setSearch,
  getActiveFiltersCount,
}) {
  return (
    <aside className="dp-sidebar">
        
          <div className="dp-filter-card">
            <div className="dp-filter-header">
              <div className="dp-filter-header-left">
                <Filter size={13} />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span
                    style={{
                      background: "#c84b2f",
                      color: "#fff",
                      borderRadius: "20px",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "1px 6px",
                      marginLeft: "2px",
                    }}
                  >
                    {getActiveFiltersCount()}
                  </span>
                )}
              </div>
              {getActiveFiltersCount() > 0 && (
                <button
                  className="dp-filter-clear"
                  onClick={() => {
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
                    setSelectedCategory("All")
                    setSearch("")
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="dp-filter-panes">
              {/* Tab list */}
              <div className="dp-filter-tabs">
                {[
                  { id: "sort", label: "Sort By" },
                  { id: "foodType", label: "Food Type" },
                  { id: "categories", label: "Category" },
                  { id: "price", label: "Price" },
                  { id: "ratings", label: "Ratings" },
                  { id: "prepTime", label: "Prep Time" },
                  { id: "spiceLevel", label: "Spice" },
                  { id: "bestSellers", label: "Best Sellers" },
                  { id: "offers", label: "Offers" },
                ].map((t) => (
                  <button
                    key={t.id}
                    className={`dp-filter-tab ${activeFilterSection === t.id ? "dp-tab-active" : ""}`}
                    onClick={() => setActiveFilterSection(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Options pane */}
              <div className="dp-filter-options">
                {activeFilterSection === "sort" &&
                  [
                    { id: "recommended", label: "Recommended" },
                    { id: "priceLow", label: "Price: Low → High" },
                    { id: "priceHigh", label: "Price: High → Low" },
                    { id: "rating", label: "Top Rated" },
                    { id: "popular", label: "Most Popular" },
                    { id: "fastServing", label: "Fast Serving" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`dp-filter-opt ${selectedFilters.sortBy === o.id ? "dp-opt-checked" : ""}`}
                    >
                      <span>{o.label}</span>
                      <input
                        type="radio"
                        checked={selectedFilters.sortBy === o.id}
                        onChange={() =>
                          setSelectedFilters({
                            ...selectedFilters,
                            sortBy: o.id,
                          })
                        }
                      />
                    </label>
                  ))}

                {activeFilterSection === "foodType" &&
                  [
                    { id: "veg", label: "Vegetarian" },
                    { id: "nonveg", label: "Non-Vegetarian" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`dp-filter-opt ${selectedFilters.foodType.includes(o.id) ? "dp-opt-checked" : ""}`}
                    >
                      <span>{o.label}</span>
                      <input
                        type="checkbox"
                        checked={selectedFilters.foodType.includes(o.id)}
                        onChange={() => {
                          const n = selectedFilters.foodType.includes(o.id)
                            ? selectedFilters.foodType.filter((t) => t !== o.id)
                            : [...selectedFilters.foodType, o.id]
                          setSelectedFilters({
                            ...selectedFilters,
                            foodType: n,
                          })
                        }}
                      />
                    </label>
                  ))}

                {activeFilterSection === "categories" && (
                  <>
                    <label
                      className={`dp-filter-opt ${selectedCategory === "All" ? "dp-opt-checked" : ""}`}
                      onClick={() => setSelectedCategory("All")}
                    >
                      <span>All Items</span>
                      <input
                        type="radio"
                        readOnly
                        checked={selectedCategory === "All"}
                      />
                    </label>
                    {categories.map((cat) => (
                      <label
                        key={cat._id}
                        className={`dp-filter-opt ${selectedCategory === cat.name ? "dp-opt-checked" : ""}`}
                        onClick={() => setSelectedCategory(cat.name)}
                      >
                        <span>{cat.name}</span>
                        <input
                          type="radio"
                          readOnly
                          checked={selectedCategory === cat.name}
                        />
                      </label>
                    ))}
                  </>
                )}

                {activeFilterSection === "price" &&
                  [
                    { id: "under100", label: "Under ₹100" },
                    { id: "100to250", label: "₹100 – ₹250" },
                    { id: "250to500", label: "₹250 – ₹500" },
                    { id: "above500", label: "Above ₹500" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`dp-filter-opt ${selectedFilters.priceRange.includes(o.id) ? "dp-opt-checked" : ""}`}
                    >
                      <span>{o.label}</span>
                      <input
                        type="checkbox"
                        checked={selectedFilters.priceRange.includes(o.id)}
                        onChange={() => {
                          const n = selectedFilters.priceRange.includes(o.id)
                            ? selectedFilters.priceRange.filter((p) => p !== o.id)
                            : [...selectedFilters.priceRange, o.id]
                          setSelectedFilters({
                            ...selectedFilters,
                            priceRange: n,
                          })
                        }}
                      />
                    </label>
                  ))}

                {activeFilterSection === "ratings" &&
                  [
                    { id: "above4", label: "4★ & Above" },
                    { id: "above3", label: "3★ & Above" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`dp-filter-opt ${selectedFilters.ratings.includes(o.id) ? "dp-opt-checked" : ""}`}
                    >
                      <span>{o.label}</span>
                      <input
                        type="checkbox"
                        checked={selectedFilters.ratings.includes(o.id)}
                        onChange={() => {
                          const n = selectedFilters.ratings.includes(o.id)
                            ? selectedFilters.ratings.filter((r) => r !== o.id)
                            : [...selectedFilters.ratings, o.id]
                          setSelectedFilters({
                            ...selectedFilters,
                            ratings: n,
                          })
                        }}
                      />
                    </label>
                  ))}

                {activeFilterSection === "prepTime" &&
                  [
                    { id: "under20", label: "Under 20 Min" },
                    { id: "20to30", label: "20 – 30 Min" },
                    { id: "above30", label: "Above 30 Min" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`dp-filter-opt ${selectedFilters.prepTime.includes(o.id) ? "dp-opt-checked" : ""}`}
                    >
                      <span>{o.label}</span>
                      <input
                        type="checkbox"
                        checked={selectedFilters.prepTime.includes(o.id)}
                        onChange={() => {
                          const n = selectedFilters.prepTime.includes(o.id)
                            ? selectedFilters.prepTime.filter((t) => t !== o.id)
                            : [...selectedFilters.prepTime, o.id]
                          setSelectedFilters({
                            ...selectedFilters,
                            prepTime: n,
                          })
                        }}
                      />
                    </label>
                  ))}

                {activeFilterSection === "spiceLevel" &&
                  [
                    { id: "mild", label: "Mild" },
                    { id: "medium", label: "Medium" },
                    { id: "spicy", label: "Spicy" },
                    { id: "extraSpicy", label: "Extra Spicy" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`dp-filter-opt ${selectedFilters.spiceLevel.includes(o.id) ? "dp-opt-checked" : ""}`}
                    >
                      <span>{o.label}</span>
                      <input
                        type="checkbox"
                        checked={selectedFilters.spiceLevel.includes(o.id)}
                        onChange={() => {
                          const n = selectedFilters.spiceLevel.includes(o.id)
                            ? selectedFilters.spiceLevel.filter((s) => s !== o.id)
                            : [...selectedFilters.spiceLevel, o.id]
                          setSelectedFilters({
                            ...selectedFilters,
                            spiceLevel: n,
                          })
                        }}
                      />
                    </label>
                  ))}

                {activeFilterSection === "bestSellers" && (
                  <label
                    className={`dp-filter-opt ${selectedFilters.bestSellers ? "dp-opt-checked" : ""}`}
                  >
                    <span>Best Sellers Only</span>
                    <input
                      type="checkbox"
                      checked={selectedFilters.bestSellers}
                      onChange={() =>
                        setSelectedFilters({
                          ...selectedFilters,
                          bestSellers: !selectedFilters.bestSellers,
                        })
                      }
                    />
                  </label>
                )}

                {activeFilterSection === "offers" && (
                  <label
                    className={`dp-filter-opt ${selectedFilters.offers ? "dp-opt-checked" : ""}`}
                  >
                    <span>Show Offers</span>
                    <input
                      type="checkbox"
                      checked={selectedFilters.offers}
                      onChange={() =>
                        setSelectedFilters({
                          ...selectedFilters,
                          offers: !selectedFilters.offers,
                        })
                      }
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </aside>
    
  )
}

export default DesktopFilters