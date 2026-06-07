import { useState } from "react"

export default function useCart(customerSessionRef) {
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [cartAnimation, setCartAnimation] = useState(false)

  const loadCartFromStorage = () => {
    const currentSessionId = customerSessionRef.current

    if (!currentSessionId) return

    const cartKey = `restaurantCart_${currentSessionId}`
    const savedCart = localStorage.getItem(cartKey)

    if (savedCart) {
      setCart(JSON.parse(savedCart))
    } else {
      setCart([])
    }
  }

  const saveCartToStorage = (updatedCart) => {
    const currentSessionId = customerSessionRef.current

    if (!currentSessionId) return

    const cartKey = `restaurantCart_${currentSessionId}`

    localStorage.setItem(
      cartKey,
      JSON.stringify(updatedCart)
    )

    setCart(updatedCart)
  }

  const addToCart = (food) => {
    const existingItem = cart.find(
      (item) => item._id === food._id
    )

    let updatedCart

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item._id === food._id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    } else {
      updatedCart = [
        ...cart,
        {
          ...food,
          quantity: 1,
        },
      ]
    }

    saveCartToStorage(updatedCart)

    setCartAnimation(true)

    setTimeout(() => {
      setCartAnimation(false)
    }, 300)
  }

  const updateQuantity = (
    foodId,
    newQuantity
  ) => {
    if (newQuantity <= 0) {
      const updatedCart = cart.filter(
        (item) => item._id !== foodId
      )

      saveCartToStorage(updatedCart)
    } else {
      const updatedCart = cart.map((item) =>
        item._id === foodId
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )

      saveCartToStorage(updatedCart)
    }
  }

  const removeFromCart = (foodId) => {
    const updatedCart = cart.filter(
      (item) => item._id !== foodId
    )

    saveCartToStorage(updatedCart)
  }

  const toggleFavorite = (food) => {
    const isAlreadyFavorite =
      favorites.find(
        (item) => item._id === food._id
      )

    let updatedFavorites

    if (isAlreadyFavorite) {
      updatedFavorites = favorites.filter(
        (item) => item._id !== food._id
      )
    } else {
      updatedFavorites = [
        ...favorites,
        food,
      ]
    }

    setFavorites(updatedFavorites)

    const currentSessionId =
      customerSessionRef.current

    const favoriteKey =
      `favoriteFoods_${currentSessionId}`

    localStorage.setItem(
      favoriteKey,
      JSON.stringify(updatedFavorites)
    )
  }

  const getCartTotal = () => {
    return cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
          Number(item.quantity),
      0
    )
  }

  const getCartItemCount = () => {
    return cart.reduce(
      (sum, item) =>
        sum + Number(item.quantity),
      0
    )
  }

 return {
  cart,
  setCart,
  favorites,
  setFavorites,
  cartAnimation,
  loadCartFromStorage,
  saveCartToStorage,
  addToCart,
  updateQuantity,
  removeFromCart,
  toggleFavorite,
  getCartTotal,
  getCartItemCount,
}
}