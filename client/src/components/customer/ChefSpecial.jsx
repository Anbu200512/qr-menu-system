import {
  ChefHat,
  Star,
} from "lucide-react"

function ChefSpecial({
  currentSpecial,
  todaySpecials,
  currentSpecialIndex,
  setCurrentSpecialIndex,
  addToCart,
}) {
  if (
    !todaySpecials.length ||
    !currentSpecial
  )
    return null

  return (
    <div className="fp-special-section">
      <div className="fp-special-section-head">
        <ChefHat
          size={15}
          style={{
            color: "#c9964a",
          }}
        />
        <span
          className="fp-section-title"
          style={{
            marginBottom: 0,
          }}
        >
          Chef's Special
        </span>
      </div>

      <div className="fp-special-card">
        <img
          src={currentSpecial.image}
          alt={currentSpecial.name}
          loading="lazy"
        />

        <div className="fp-special-overlay" />

        <div className="fp-special-content">
          <div className="fp-special-badges">
            <span className="fp-badge fp-badge-gold">
              <Star
                size={9}
                style={{
                  fill: "#fff",
                }}
              />
              {currentSpecial.rating ||
                4.5}
            </span>

            <span className="fp-badge fp-badge-ghost">
              {currentSpecial.isVeg
                ? "Vegetarian"
                : "Non-Veg"}
            </span>
          </div>

          <div className="fp-special-name">
            {currentSpecial.name}
          </div>

          <div className="fp-special-footer">
            <span className="fp-special-price">
              ₹{currentSpecial.price}
            </span>

            <button
              onClick={() =>
                addToCart(
                  currentSpecial
                )
              }
              className="fp-special-add-btn"
            >
              + Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="fp-special-dots">
        {todaySpecials.map(
          (_, idx) => (
            <button
              key={idx}
              onClick={() =>
                setCurrentSpecialIndex(
                  idx
                )
              }
              className={`fp-special-dot ${
                idx ===
                currentSpecialIndex
                  ? "active"
                  : ""
              }`}
            />
          )
        )}
      </div>
    </div>
  )
}

export default ChefSpecial