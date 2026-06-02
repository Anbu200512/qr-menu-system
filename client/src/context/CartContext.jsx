import {
  createContext,
  useState,
} from "react"

export const CartContext =
  createContext()

function CartProvider({ children }) {
  const [cartItems, setCartItems] =
    useState([])

  const [isCartOpen, setIsCartOpen] =
    useState(false)

  // ADD TO CART
  const addToCart = (food) => {
    const existingItem = cartItems.find(
      (item) => item._id === food._id
    )

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item._id === food._id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      )
    } else {
      setCartItems([
        ...cartItems,
        {
          ...food,
          quantity: 1,
        },
      ])
    }

    setIsCartOpen(true)
  }

  // INCREASE
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    )
  }

  // DECREASE
  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    )
  }

  // REMOVE
  const removeItem = (id) => {
    setCartItems(
      cartItems.filter(
        (item) => item._id !== id
      )
    )
  }

  // CLEAR CART
const clearCart = () => {
  setCartItems([])
}

  // TOTAL
  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider