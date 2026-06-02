import {
  useContext,
  useState,
} from "react"

import {
  FaTimes,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa"

import toast from "react-hot-toast"

import { CartContext } from "../../context/CartContext"

import { placeOrder } from "../../services/orderService"

function CartDrawer() {
  const {
    cartItems,
    totalAmount,
    isCartOpen,
    setIsCartOpen,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  } = useContext(CartContext)

  const [customerName, setCustomerName] =
    useState("")

  const [tableNumber, setTableNumber] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  // PLACE ORDER
  const handlePlaceOrder =
    async () => {
      if (
        !customerName ||
        !tableNumber
      ) {
        toast.error(
          "Enter customer details"
        )

        return
      }

      try {
        setLoading(true)

        const orderData = {
          customerName,
          tableNumber,
          items: cartItems.map((item) => ({
            food: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          totalAmount,
        }

        await placeOrder(orderData)

        toast.success(
          "Order placed successfully"
        )

        // CLEAR CART
        clearCart()

        // RESET FORM
        setCustomerName("")

        setTableNumber("")

        // CLOSE DRAWER
        setIsCartOpen(false)
      } catch (error) {
        console.log(error)

        toast.error("Order Failed")
      } finally {
        setLoading(false)
      }
    }

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          onClick={() =>
            setIsCartOpen(false)
          }
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 transition-all duration-300 flex flex-col ${
          isCartOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-3xl font-bold">
            Your Cart
          </h2>

          <button
            onClick={() =>
              setIsCartOpen(false)
            }
            className="text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex justify-center items-center text-gray-400 text-2xl font-semibold">
            Cart is Empty
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 bg-gray-50 rounded-2xl p-4"
                >
                  {/* Image */}
                  <img
                    src={` ${import.meta.env.VITE_API_URL}${item.image}`}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-lg">
                        {item.name}
                      </h3>

                      <button
                        onClick={() =>
                          removeItem(
                            item._id
                          )
                        }
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <p className="text-green-600 font-bold mt-2">
                     ₹{Number(item.price) * Number(item.quantity)}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-4">
                      {/* Decrease */}
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item._id
                          )
                        }
                        className="bg-gray-200 p-2 rounded-lg"
                      >
                        <FaMinus />
                      </button>

                      {/* Quantity */}
                      <span className="font-bold text-lg">
                        {item.quantity}
                      </span>

                      {/* Increase */}
                      <button
                        onClick={() =>
                          increaseQuantity(
                            item._id
                          )
                        }
                        className="bg-green-600 text-white p-2 rounded-lg"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t p-5">
              {/* Customer Details */}
              <div className="space-y-3 mb-5">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value
                    )
                  }
                  className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                />

                <input
                  type="text"
                  placeholder="Table Number"
                  value={tableNumber}
                  onChange={(e) =>
                    setTableNumber(
                      e.target.value
                    )
                  }
                  className="w-full border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-2xl font-bold">
                  Total
                </h3>

                <p className="text-3xl font-bold text-green-600">
                  ₹{totalAmount}
                </p>
              </div>

              {/* Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-semibold transition-all"
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CartDrawer