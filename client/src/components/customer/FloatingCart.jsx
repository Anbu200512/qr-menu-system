import {
  useContext,
} from "react"

import { FaShoppingCart } from "react-icons/fa"

import { CartContext } from "../../context/CartContext"

function FloatingCart() {
  const {
    cartItems,
    totalAmount,
    setIsCartOpen,
  } = useContext(CartContext)

  return (
    <button
      onClick={() =>
        setIsCartOpen(true)
      }
      className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-40 transition-all"
    >
      <FaShoppingCart className="text-2xl" />

      <div className="text-left">
        <p className="font-bold">
          {cartItems.length} Items
        </p>

        <p>₹{totalAmount}</p>
      </div>
    </button>
  )
}

export default FloatingCart