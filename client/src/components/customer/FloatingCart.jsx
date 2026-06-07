import {
  ShoppingBag,
  ChevronRight,
} from "lucide-react"

function FloatingCart({
  cart,
  getCartItemCount,
  getCartTotal,
  setIsCartOpen,
}) {
  if (cart.length === 0) return null

  return (
    <div className="fp-floating-cart">
      <button
        className="fp-floating-cart-btn"
        onClick={() => setIsCartOpen(true)}
      >
        <div className="fp-floating-cart-left">
          <div className="fp-floating-cart-icon">
            <ShoppingBag />
          </div>

          <div>
            <div className="fp-floating-cart-label">
              {getCartItemCount()} item
              {getCartItemCount() !== 1 ? "s" : ""} added
            </div>

            <div className="fp-floating-cart-sublabel">
              Tap to view cart
            </div>
          </div>
        </div>

        <div>
          <div className="fp-floating-cart-total">
            ₹{getCartTotal()}
          </div>

          <div className="fp-floating-cart-cta">
            View Cart
            <ChevronRight size={12} />
          </div>
        </div>
      </button>
    </div>
  )
}

export default FloatingCart