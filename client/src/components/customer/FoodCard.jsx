import {
  Heart,
  Award,
  Star,
  Clock,
  Plus,
  Minus,
} from "lucide-react"

function FoodCard({
  food,
  cart = [],
  favorites = [],
  addToCart,
  updateQuantity,
  toggleFavorite,
}) {
  const cartItem = cart.find(
    (item) => item._id === food._id
  )

  const isFav = favorites.find(
    (item) => item._id === food._id
  )

  return (
    <div className="fp-food-card">
      <div className="fp-food-img-wrap">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
        />

        <button
          className="fp-favorite-btn"
          onClick={() =>
            toggleFavorite(food)
          }
        >
          <Heart
            size={14}
            fill={
              isFav
                ? "#ef4444"
                : "transparent"
            }
            color={
              isFav
                ? "#ef4444"
                : "white"
            }
          />
        </button>

        {food.isPopular && (
          <div className="fp-bestseller-tag">
            <Award size={9} />
            Best
          </div>
        )}
      </div>

      <div className="fp-food-info">
        <div className="fp-food-name">
          {food.name}
        </div>

        <div className="fp-food-meta">
          <span className="fp-food-meta-item">
            <Star
              size={10}
              style={{
                fill: "#f59e0b",
                color: "#f59e0b",
              }}
            />
            {food.rating || 4.5}
          </span>

          <span className="fp-food-meta-sep">
            ·
          </span>

          <span className="fp-food-meta-item">
            <Clock size={10} />
            {food.prepTime || 20}m
          </span>
        </div>

        <div className="fp-food-footer">
          <span className="fp-food-price">
            ₹{food.price}
          </span>

          {cartItem ? (
            <div className="fp-qty-ctrl">
              <button
                className="fp-qty-btn"
                onClick={() =>
                  updateQuantity(
                    food._id,
                    cartItem.quantity - 1
                  )
                }
              >
                <Minus size={10} />
              </button>

              <span className="fp-qty-num">
                {cartItem.quantity}
              </span>

              <button
                className="fp-qty-btn"
                onClick={() =>
                  updateQuantity(
                    food._id,
                    cartItem.quantity + 1
                  )
                }
              >
                <Plus size={10} />
              </button>
            </div>
          ) : (
            <button
              className="fp-add-btn"
              onClick={() =>
                addToCart(food)
              }
            >
              <Plus size={11} />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodCard