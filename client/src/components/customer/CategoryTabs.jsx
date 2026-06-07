import { UtensilsCrossed } from "lucide-react"

function CategoryTabs({
  categories,
  selectedCategory,
  setSelectedCategory,
  setVisibleItems,
  categoryIcons,
}) {
  return (
    <div className="fp-categories-section">
      <div className="fp-categories-scroll">
        <button
          onClick={() => {
            setSelectedCategory("All")
            setVisibleItems(8)
          }}
          className={`fp-cat-pill ${
            selectedCategory === "All"
              ? "active"
              : ""
          }`}
        >
          <UtensilsCrossed size={13} />
          All
        </button>

        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => {
              setSelectedCategory(
                category.name
              )
              setVisibleItems(8)
            }}
            className={`fp-cat-pill ${
              selectedCategory ===
              category.name
                ? "active"
                : ""
            }`}
          >
            {categoryIcons[
              category.name
            ] || (
              <UtensilsCrossed
                size={13}
              />
            )}

            {category.name.length > 10
              ? category.name.slice(
                  0,
                  9
                ) + "…"
              : category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryTabs