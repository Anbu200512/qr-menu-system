
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
} from "lucide-react"
function CartDrawer({
  isCartOpen,
  setIsCartOpen,
  cart,
  updateQuantity,
  removeFromCart,
  getCartTotal,
  setShowTableModal,
}) {
  if (!isCartOpen) return null

  return (
    
                  <div
                    className="fp-overlay"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <div
                      className="fp-cart-drawer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="fp-cart-header">
                        <div className="fp-cart-header-inner">
                          <div>
                            <div className="fp-cart-title">Your Cart</div>
                            <div className="fp-cart-subtitle">
                              {cart.length} item{cart.length !== 1 ? "s" : ""}{" "}
                              selected
                            </div>
                          </div>
                          <button
                            className="fp-cart-close"
                            onClick={() => setIsCartOpen(false)}
                          >
                            <X />
                          </button>
                        </div>
                      </div>
                      {cart.length === 0 ? (
                        <div className="fp-cart-empty">
                          <div className="fp-cart-empty-icon">
                            <ShoppingBag />
                          </div>
                          <p>Your cart is empty</p>
                          <small>Add delicious items from our menu</small>
                        </div>
                      ) : (
                        <>
                          <div className="fp-cart-items">
                            {cart.map((item) => (
                              <div key={item._id} className="fp-cart-item">
                                <img
        src={item.image}
        alt={item.name}
        loading="lazy"
      />
                                <div className="fp-cart-item-info">
                                  <div className="fp-cart-item-name">
                                    {item.name}
                                  </div>
                                  <div className="fp-cart-item-sub">
                                    {item.isVeg ? "Vegetarian" : "Non-Veg"}
                                  </div>
                                  <div className="fp-cart-item-price">
                                    ₹{Number(item.price) * Number(item.quantity)}
                                  </div>
                                  <div className="fp-cart-item-actions">
                                    <div className="fp-qty-ctrl">
                                      <button
                                        className="fp-qty-btn"
                                        onClick={() =>
                                          updateQuantity(
                                            item._id,
                                            item.quantity - 1
                                          )
                                        }
                                      >
                                        <Minus size={10} />
                                      </button>
                                      <span className="fp-qty-num">
                                        {item.quantity}
                                      </span>
                                      <button
                                        className="fp-qty-btn"
                                        onClick={() =>
                                          updateQuantity(
                                            item._id,
                                            item.quantity + 1
                                          )
                                        }
                                      >
                                        <Plus size={10} />
                                      </button>
                                    </div>
                                    <button
                                      className="fp-cart-remove"
                                      onClick={() => removeFromCart(item._id)}
                                    >
                                      <Trash2 size={12} /> Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="fp-cart-footer">
                            <button
                              className="fp-checkout-btn"
                              onClick={() => setShowTableModal(true)}
                            >
                              <span>Proceed to Order</span>
                              <strong>₹{getCartTotal()}</strong>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                 )
}

export default CartDrawer