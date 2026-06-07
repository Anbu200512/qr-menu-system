 import {
  SlidersHorizontal,
  X,
} from "lucide-react"
 function FilterSheet({
  showFilterModal,
  setShowFilterModal,
  filterSections,
  activeFilterSection,
  setActiveFilterSection,
  selectedFilters,
  setSelectedFilters,
  categories,
  getSortedFoods,
}) {
  if (!showFilterModal) return null

  return (
    <div
      className="fp-overlay"
      onClick={() => setShowFilterModal(false)}
    >
      <div
        className="fp-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "92vh" }}
      >
        
              
                <div className="fp-sheet-handle" />
                <div className="fp-sheet-header">
                  <div className="fp-sheet-title">
                    <SlidersHorizontal /> Filter Foods
                  </div>
                  <button
                    className="fp-sheet-close"
                    onClick={() => setShowFilterModal(false)}
                  >
                    <X />
                  </button>
                </div>
                <div
                  className="fp-filter-body"
                  style={{ flex: 1, overflow: "hidden" }}
                >
                  <div className="fp-filter-sidebar">
                    {filterSections.map((s) => (
                      <button
                        key={s.id}
                        className={`fp-filter-sidebar-btn ${activeFilterSection === s.id ? "active" : ""}`}
                        onClick={() => setActiveFilterSection(s.id)}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                  <div className="fp-filter-panel">
                    {activeFilterSection === "sort" && (
                      <div>
                        <div className="fp-filter-group-title">Sort By</div>
                        {[
                          { id: "recommended", label: "Recommended" },
                          { id: "priceLow", label: "Price: Low to High" },
                          { id: "priceHigh", label: "Price: High to Low" },
                          { id: "rating", label: "Top Rated" },
                          { id: "popular", label: "Most Popular" },
                          { id: "fastServing", label: "Fast Serving" },
                        ].map((o) => (
                          <label key={o.id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {o.label}
                            </span>
                            <input
                              type="radio"
                              name="sortBy"
                              className="fp-filter-radio"
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
                      </div>
                    )}
                    {activeFilterSection === "foodType" && (
                      <div>
                        <div className="fp-filter-group-title">Food Type</div>
                        {[
                          { id: "veg", label: "Vegetarian" },
                          { id: "nonveg", label: "Non-Vegetarian" },
                        ].map((o) => (
                          <label key={o.id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {o.label}
                            </span>
                            <input
                              type="checkbox"
                              className="fp-filter-check"
                              checked={selectedFilters.foodType.includes(o.id)}
                              onChange={() => {
                                const n = selectedFilters.foodType.includes(
                                  o.id
                                )
                                  ? selectedFilters.foodType.filter(
                                      (t) => t !== o.id
                                    )
                                  : [...selectedFilters.foodType, o.id]
                                setSelectedFilters({
                                  ...selectedFilters,
                                  foodType: n,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {activeFilterSection === "categories" && (
                      <div>
                        <div className="fp-filter-group-title">Categories</div>
                        {categories.map((cat) => (
                          <label key={cat._id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {cat.name}
                            </span>
                            <input
                              type="checkbox"
                              className="fp-filter-check"
                              checked={selectedFilters.categories.includes(
                                cat.name
                              )}
                              onChange={() => {
                                const n = selectedFilters.categories.includes(
                                  cat.name
                                )
                                  ? selectedFilters.categories.filter(
                                      (c) => c !== cat.name
                                    )
                                  : [...selectedFilters.categories, cat.name]
                                setSelectedFilters({
                                  ...selectedFilters,
                                  categories: n,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {activeFilterSection === "price" && (
                      <div>
                        <div className="fp-filter-group-title">
                          Price Range
                        </div>
                        {[
                          { id: "under100", label: "Under ₹100" },
                          { id: "100to250", label: "₹100 – ₹250" },
                          { id: "250to500", label: "₹250 – ₹500" },
                          { id: "above500", label: "Above ₹500" },
                        ].map((o) => (
                          <label key={o.id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {o.label}
                            </span>
                            <input
                              type="checkbox"
                              className="fp-filter-check"
                              checked={selectedFilters.priceRange.includes(
                                o.id
                              )}
                              onChange={() => {
                                const n = selectedFilters.priceRange.includes(
                                  o.id
                                )
                                  ? selectedFilters.priceRange.filter(
                                      (p) => p !== o.id
                                    )
                                  : [...selectedFilters.priceRange, o.id]
                                setSelectedFilters({
                                  ...selectedFilters,
                                  priceRange: n,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {activeFilterSection === "ratings" && (
                      <div>
                        <div className="fp-filter-group-title">
                          Minimum Rating
                        </div>
                        {[
                          { id: "above4", label: "⭐ 4.0 & above" },
                          { id: "above3", label: "⭐ 3.0 & above" },
                        ].map((o) => (
                          <label key={o.id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {o.label}
                            </span>
                            <input
                              type="checkbox"
                              className="fp-filter-check"
                              checked={selectedFilters.ratings.includes(o.id)}
                              onChange={() => {
                                const n = selectedFilters.ratings.includes(o.id)
                                  ? selectedFilters.ratings.filter(
                                      (r) => r !== o.id
                                    )
                                  : [...selectedFilters.ratings, o.id]
                                setSelectedFilters({
                                  ...selectedFilters,
                                  ratings: n,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {activeFilterSection === "prepTime" && (
                      <div>
                        <div className="fp-filter-group-title">
                          Preparation Time
                        </div>
                        {[
                          { id: "under20", label: "Under 20 minutes" },
                          { id: "20to30", label: "20 – 30 minutes" },
                          { id: "above30", label: "Above 30 minutes" },
                        ].map((o) => (
                          <label key={o.id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {o.label}
                            </span>
                            <input
                              type="checkbox"
                              className="fp-filter-check"
                              checked={selectedFilters.prepTime.includes(o.id)}
                              onChange={() => {
                                const n = selectedFilters.prepTime.includes(
                                  o.id
                                )
                                  ? selectedFilters.prepTime.filter(
                                      (t) => t !== o.id
                                    )
                                  : [...selectedFilters.prepTime, o.id]
                                setSelectedFilters({
                                  ...selectedFilters,
                                  prepTime: n,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {activeFilterSection === "spiceLevel" && (
                      <div>
                        <div className="fp-filter-group-title">
                          Spice Level
                        </div>
                        {[
                          { id: "mild", label: "Mild 😊" },
                          { id: "medium", label: "Medium 😐" },
                          { id: "spicy", label: "Spicy 🔥" },
                          { id: "extraSpicy", label: "Extra Spicy 🌶️" },
                        ].map((o) => (
                          <label key={o.id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {o.label}
                            </span>
                            <input
                              type="checkbox"
                              className="fp-filter-check"
                              checked={selectedFilters.spiceLevel.includes(
                                o.id
                              )}
                              onChange={() => {
                                const n = selectedFilters.spiceLevel.includes(
                                  o.id
                                )
                                  ? selectedFilters.spiceLevel.filter(
                                      (s) => s !== o.id
                                    )
                                  : [...selectedFilters.spiceLevel, o.id]
                                setSelectedFilters({
                                  ...selectedFilters,
                                  spiceLevel: n,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {activeFilterSection === "bestSellers" && (
                      <div>
                        <div className="fp-filter-group-title">
                          Best Sellers
                        </div>
                        <label className="fp-filter-option">
                          <span className="fp-filter-option-label">
                            Show only best sellers
                          </span>
                          <input
                            type="checkbox"
                            className="fp-filter-check"
                            checked={selectedFilters.bestSellers}
                            onChange={() =>
                              setSelectedFilters({
                                ...selectedFilters,
                                bestSellers: !selectedFilters.bestSellers,
                              })
                            }
                          />
                        </label>
                      </div>
                    )}
                    {activeFilterSection === "offers" && (
                      <div>
                        <div className="fp-filter-group-title">Offers</div>
                        <label className="fp-filter-option">
                          <span className="fp-filter-option-label">
                            Show items with offers
                          </span>
                          <input
                            type="checkbox"
                            className="fp-filter-check"
                            checked={selectedFilters.offers}
                            onChange={() =>
                              setSelectedFilters({
                                ...selectedFilters,
                                offers: !selectedFilters.offers,
                              })
                            }
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div className="fp-sheet-footer">
                  <button
                    className="fp-btn-outline"
                    onClick={() =>
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
                    }
                  >
                    Clear All
                  </button>
                  <button
                    className="fp-btn-primary"
                    onClick={() => setShowFilterModal(false)}
                  >
                    Show {getSortedFoods().length} Foods
                  </button>
                </div>
              </div>
            </div>
      
  )
}

export default FilterSheet
            
        