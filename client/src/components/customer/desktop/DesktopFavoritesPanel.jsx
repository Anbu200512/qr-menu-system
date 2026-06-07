import { Heart, Plus, Minus, Trash2 } from "lucide-react";

function DesktopFavoritesPanel({
  favorites,
  cart,
  addToCart,
  updateQuantity,
  toggleFavorite,
}) {
  if (favorites.length === 0) {
    return (
      <div className="df-empty">
        <div className="df-empty-icon">
          <Heart size={34} />
        </div>

        <h3>No Favorites Yet</h3>

        <p>Tap ♥ on any dish to save it here</p>
      </div>
    );
  }

  return (
    <div className="df-wrapper">
      {favorites.map((food) => {
        const cartItem = cart.find((item) => item._id === food._id);

        return (
          <div key={food._id} className="df-card">
            <img
              src={food.image}
              alt={food.name}
              className="df-image"
              loading="lazy"
            />

            <div className="df-content">
              <h4 className="df-name">{food.name}</h4>

              <div className="df-category">{food.category?.name}</div>

              <div className="df-price">₹{food.price}</div>

              <div className="df-actions">
                {cartItem ? (
                  <div className="df-qty">
                    <button
                      onClick={() =>
                        updateQuantity(food._id, cartItem.quantity - 1)
                      }
                    >
                      <Minus size={12} />
                    </button>

                    <span>{cartItem.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(food._id, cartItem.quantity + 1)
                      }
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="df-add-btn"
                    onClick={() => addToCart(food)}
                  >
                    <Plus size={13} />
                    Add
                  </button>
                )}

                <button
                  className="df-remove-btn"
                  onClick={() => toggleFavorite(food)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DesktopFavoritesPanel;
