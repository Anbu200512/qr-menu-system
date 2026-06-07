import { ShoppingBag, Plus, Minus, Trash2, ChevronRight } from "lucide-react";

function DesktopCartPanel({
  cart,
  updateQuantity,
  removeFromCart,
  getCartTotal,
  setShowTableModal,
}) {
  if (cart.length === 0) {
    return (
      <div className="dcart-empty">
        <div className="dcart-empty-icon">
          <ShoppingBag size={34} />
        </div>

        <h3>Your Cart is Empty</h3>

        <p>Add delicious items from our menu</p>
      </div>
    );
  }

  return (
    <div className="dcart-wrapper">
      {cart.map((item) => (
        <div key={item._id} className="dcart-card">
          <img src={item.image} alt={item.name} className="dcart-image" />

          <div className="dcart-content">
            <h4 className="dcart-name">{item.name}</h4>

            <div className="dcart-type">
              {item.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
            </div>

            <div className="dcart-price">
              ₹{Number(item.price) * Number(item.quantity)}
            </div>

            <div className="dcart-actions">
              <div className="dcart-qty">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                >
                  <Minus size={12} />
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                >
                  <Plus size={12} />
                </button>
              </div>

              <button
                className="dcart-remove"
                onClick={() => removeFromCart(item._id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="dcart-footer">
        <div className="dcart-total">
          <span>Total</span>

          <strong>₹{getCartTotal()}</strong>
        </div>

        <button
          className="dcart-order-btn"
          onClick={() => {
            console.log("PLACE ORDER CLICKED");
            setShowTableModal(true);
          }}
        >
          Place Order
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default DesktopCartPanel;
