import { useEffect, useState, useRef } from "react"
import { getFoods } from "../../services/foodService"
import { getCategories } from "../../services/categoryService"
import { createOrder } from "../../services/orderService"
import { getBanners } from "../../services/bannerService"
import { createWaiterCall } from "../../services/waiterCallService"
import { useParams } from "react-router-dom"
import axios from "axios"
import {
  getAdvertisements,
} from "../../services/advertisementService"
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Home,
  ClipboardList,
  Receipt,
  Phone,
  X,
  Plus,
  Minus,
  Trash2,
  Star,
  Clock,
  CheckCircle,
  ChevronRight,
  Coffee,
  ChefHat,
  Zap,
  Award,
  Heart,
  MapPin,
  Users,
  UtensilsCrossed,
  Building2,
  Clock3,
  Mail,
  Globe,
  ShieldCheck,
  Filter,
  ChevronDown,
  Sparkles,
} from "lucide-react"

function MenuPage() {
  const customerSessionRef = useRef("")
  const { tableId } = useParams()

  const [showWaiterSuccess, setShowWaiterSuccess] = useState(false)
  const [foods, setFoods] = useState([])
  const [banners, setBanners] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [vegFilter, setVegFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("home")
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showFavoritesModal, setShowFavoritesModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showOrdersModal, setShowOrdersModal] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showBillModal, setShowBillModal] = useState(false)
  const [showTableModal, setShowTableModal] = useState(false)
  const [showTrackOrders, setShowTrackOrders] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)
  const [tableNumber, setTableNumber] = useState(tableId || "")
  const [customerName, setCustomerName] = useState("")
  const [customerSessionId, setCustomerSessionId] = useState("")
  const [isCalling, setIsCalling] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [currentSpecialIndex, setCurrentSpecialIndex] = useState(0)
  const [showOrderSuccess, setShowOrderSuccess] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [activeFilterSection, setActiveFilterSection] = useState("sort")
  const [cartAnimation, setCartAnimation] = useState(false)
  const [visibleItems, setVisibleItems] = useState(8)
  const [advertisements, setAdvertisements] =
  useState([])

  // Desktop panel state — null | 'orders' | 'favorites' | 'call' | 'cart' | 'info'
  const [desktopPanel, setDesktopPanel] = useState(null)

  const [selectedFilters, setSelectedFilters] = useState({
    sortBy: "recommended",
    foodType: [],
    categories: [],
    priceRange: [],
    ratings: [],
    prepTime: [],
    spiceLevel: [],
    bestSellers: false,
    offers: false,
    availability: "all",
  })

  const categoriesScrollRef = useRef(null)
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  )

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const categoryIcons = {
    All: <UtensilsCrossed size={14} />,
    Biryani: <ChefHat size={14} />,
    Chicken: <Coffee size={14} />,
    Mutton: <Coffee size={14} />,
    Egg: <Coffee size={14} />,
    "Fast Food": <Zap size={14} />,
    Pizza: <ChefHat size={14} />,
    Burger: <ChefHat size={14} />,
    Pasta: <ChefHat size={14} />,
    Seafood: <Coffee size={14} />,
    BBQ: <ChefHat size={14} />,
    Chinese: <ChefHat size={14} />,
    Drinks: <Coffee size={14} />,
    Desserts: <Coffee size={14} />,
    Salads: <Coffee size={14} />,
    Breakfast: <Coffee size={14} />,
    Rolls: <ChefHat size={14} />,
    Curry: <ChefHat size={14} />,
    Noodles: <ChefHat size={14} />,
    Rice: <ChefHat size={14} />,
    Sandwich: <ChefHat size={14} />,
    Wrap: <ChefHat size={14} />,
    Fries: <ChefHat size={14} />,
    "Ice Cream": <Coffee size={14} />,
    Cake: <Coffee size={14} />,
  }

  useEffect(() => {
  const loadAds = async () => {
    try {
      const data =
        await getAdvertisements()

      setAdvertisements(
        data.advertisements || []
      )
    } catch (err) {
      console.log(err)
    }
  }

  loadAds()
}, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!customerSessionId) return
    fetchActiveOrder()
    const interval = setInterval(() => fetchActiveOrder(), 5000)
    return () => clearInterval(interval)
  }, [customerSessionId])

  useEffect(() => {
    if (banners.length === 0) return
    const bannerInterval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(bannerInterval)
  }, [banners.length])

  useEffect(() => {
    const specialItems = foods.filter((f) => f.isPopular)
    if (specialItems.length > 0) {
      const specialInterval = setInterval(() => {
        setCurrentSpecialIndex((prev) => (prev + 1) % specialItems.length)
      }, 4000)
      return () => clearInterval(specialInterval)
    }
  }, [foods])

  const [activeOrders, setActiveOrders] = useState([])
  const fetchActiveOrder = async () => {
    try {
      const currentSessionId = customerSessionRef.current
      if (!currentSessionId) return
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/session/${currentSessionId}`
      )
      if (response.data.success) {
        setActiveOrders(response.data.orders || [])
      }
    } catch (error) {
      console.log(error)
      setActiveOrders([])
    }
  }

  useEffect(() => {
    fetchData()
    const savedName = sessionStorage.getItem(`customerName_${tableId}`)
    if (savedName) setCustomerName(savedName)

    let savedCustomerSession = sessionStorage.getItem("customerSessionId")
    if (!savedCustomerSession) {
      savedCustomerSession = `CUS-${tableId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      sessionStorage.setItem("customerSessionId", savedCustomerSession)
    }
    setCustomerSessionId(savedCustomerSession)
    customerSessionRef.current = savedCustomerSession
    loadCartFromStorage()

    const favoriteKey = `favoriteFoods_${savedCustomerSession}`
    const savedFavorites = localStorage.getItem(favoriteKey)
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    } else {
      setFavorites([])
    }
  }, [])

  const fetchData = async () => {
    try {
      const foodData = await getFoods()
      const categoryData = await getCategories()
      const bannerData = await getBanners()
      setFoods(foodData?.foods || [])
      setCategories(categoryData?.categories || [])
      setBanners(
        bannerData.banners
          .filter((banner) => banner.isActive)
          .sort((a, b) => a.priority - b.priority)
      )
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

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
    localStorage.setItem(cartKey, JSON.stringify(updatedCart))
    setCart(updatedCart)
  }

  const addToCart = (food) => {
    const existingItem = cart.find((item) => item._id === food._id)
    let updatedCart
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
      )
    } else {
      updatedCart = [...cart, { ...food, quantity: 1 }]
    }
    saveCartToStorage(updatedCart)
    setCartAnimation(true)
    setTimeout(() => setCartAnimation(false), 300)
  }

  const updateQuantity = (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      const updatedCart = cart.filter((item) => item._id !== foodId)
      saveCartToStorage(updatedCart)
    } else {
      const updatedCart = cart.map((item) =>
        item._id === foodId ? { ...item, quantity: newQuantity } : item
      )
      saveCartToStorage(updatedCart)
    }
  }

  const removeFromCart = (foodId) => {
    const updatedCart = cart.filter((item) => item._id !== foodId)
    saveCartToStorage(updatedCart)
  }

  const toggleFavorite = (food) => {
    const isAlreadyFavorite = favorites.find((item) => item._id === food._id)
    let updatedFavorites
    if (isAlreadyFavorite) {
      updatedFavorites = favorites.filter((item) => item._id !== food._id)
    } else {
      updatedFavorites = [...favorites, food]
    }
    setFavorites(updatedFavorites)
    const currentSessionId = customerSessionRef.current
    const favoriteKey = `favoriteFoods_${currentSessionId}`
    localStorage.setItem(favoriteKey, JSON.stringify(updatedFavorites))
  }

  const getCartTotal = () => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    )
  }

  const combinedBillTotal = activeOrders.reduce(
    (total, order) => total + order.totalAmount,
    0
  )

  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + Number(item.quantity), 0)
  }

  const placeOrder = async () => {
    if (!tableId) {
      alert("Please scan restaurant table QR to place dine-in order 🍽️")
      return
    }
    if (!customerName.trim()) {
      alert("Please enter your name")
      return
    }
    const finalTableNumber = tableId || tableNumber
    if (cart.length === 0) {
      alert("Your cart is empty")
      return
    }
    try {
      const orderDetails = {
        orderId: "ORD-" + Math.floor(Math.random() * 900000),
        customerSessionId,
        customerName,
        tableNumber: finalTableNumber,
        items: cart,
        totalAmount: getCartTotal(),
      }
      await createOrder(orderDetails)
      sessionStorage.setItem(`customerName_${tableId}`, customerName)
      fetchActiveOrder()
      setShowOrderSuccess(true)
      saveCartToStorage([])
      setCart([])
      setShowTableModal(false)
      if (!tableId) setTableNumber("")
      setIsCartOpen(false)
      if (isDesktop) setDesktopPanel(null)
      setTimeout(() => setShowOrderSuccess(false), 3000)
    } catch (error) {
      console.log(error)
      alert("Failed to place order")
    }
  }

  const handleCallWaiter = async () => {
    if (!tableId) {
      alert("Please scan restaurant table QR to call waiter 🕒")
      return
    }
    if (!customerName) {
      alert("Enter your name")
      return
    }
    const finalTableNumber = tableId || tableNumber
    try {
      setIsCalling(true)
      await createWaiterCall({ customerName, tableNumber: finalTableNumber })
      setShowWaiterSuccess(true)
      setTimeout(() => setShowWaiterSuccess(false), 3000)
      setShowCallModal(false)
      setTableNumber("")
    } catch (error) {
      console.log(error)
    } finally {
      setIsCalling(false)
    }
  }

  const displayFoods = showFavoritesOnly
    ? foods.filter((food) => favorites.some((fav) => fav._id === food._id))
    : foods

  const filteredFoods = (displayFoods || []).filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || food.category?.name === selectedCategory
    let matchesVeg = true
    if (vegFilter === "veg") matchesVeg = food.isVeg
    else if (vegFilter === "nonveg") matchesVeg = !food.isVeg
    let matchesFoodType = true
    if (selectedFilters.foodType.length > 0) {
      matchesFoodType = selectedFilters.foodType.some((type) => {
        if (type === "veg") return food.isVeg
        if (type === "nonveg") return !food.isVeg
        return false
      })
    }
    let matchesPrice = true
    if (selectedFilters.priceRange.length > 0) {
      matchesPrice = selectedFilters.priceRange.some((range) => {
        if (range === "under100") return food.price < 100
        if (range === "100to250") return food.price >= 100 && food.price <= 250
        if (range === "250to500") return food.price > 250 && food.price <= 500
        if (range === "above500") return food.price > 500
        return false
      })
    }
    let matchesRating = true
    if (selectedFilters.ratings.length > 0) {
      matchesRating = selectedFilters.ratings.some((rating) => {
        if (rating === "above4") return (food.rating || 4.5) >= 4
        if (rating === "above3") return (food.rating || 4.5) >= 3
        return false
      })
    }
    let matchesPrepTime = true
    if (selectedFilters.prepTime.length > 0) {
      matchesPrepTime = selectedFilters.prepTime.some((time) => {
        if (time === "under20") return (food.prepTime || 25) <= 20
        if (time === "20to30")
          return (food.prepTime || 25) >= 20 && (food.prepTime || 25) <= 30
        if (time === "above30") return (food.prepTime || 25) > 30
        return false
      })
    }
    let matchesSpice = true
    if (selectedFilters.spiceLevel.length > 0) {
      matchesSpice = selectedFilters.spiceLevel.includes(
        food.spiceLevel || "medium"
      )
    }
    let matchesBestSeller = true
    if (selectedFilters.bestSellers) matchesBestSeller = food.isPopular
    let matchesOffers = true
    if (selectedFilters.offers) matchesOffers = food.hasOffer || false
    return (
      matchesSearch &&
      matchesCategory &&
      matchesVeg &&
      matchesFoodType &&
      matchesPrice &&
      matchesRating &&
      matchesPrepTime &&
      matchesSpice &&
      matchesBestSeller &&
      matchesOffers
    )
  })

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200
      if (nearBottom) {
        setVisibleItems((prev) => {
          if (prev >= getSortedFoods().length) return prev
          return prev + 8
        })
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [filteredFoods])

  const getSortedFoods = () => {
    let sorted = [...filteredFoods]
    if (selectedFilters.sortBy === "priceLow")
      sorted.sort((a, b) => a.price - b.price)
    else if (selectedFilters.sortBy === "priceHigh")
      sorted.sort((a, b) => b.price - a.price)
    else if (selectedFilters.sortBy === "rating")
      sorted.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5))
    else if (selectedFilters.sortBy === "popular")
      sorted.sort(
        (a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
      )
    else if (selectedFilters.sortBy === "fastServing")
      sorted.sort((a, b) => (a.prepTime || 25) - (b.prepTime || 25))
    return sorted
  }

  const todaySpecials = foods.filter((food) => food.isPopular)
  const currentSpecial = todaySpecials[currentSpecialIndex]

  const getActiveFiltersCount = () => {
    let count = 0
    count += selectedFilters.foodType.length
    count += selectedFilters.categories.length
    count += selectedFilters.priceRange.length
    count += selectedFilters.ratings.length
    count += selectedFilters.prepTime.length
    count += selectedFilters.spiceLevel.length
    if (selectedFilters.bestSellers) count++
    if (selectedFilters.offers) count++
    if (selectedFilters.sortBy !== "recommended") count++
    return count
  }

  const filterSections = [
    { id: "sort", name: "Sort By" },
    { id: "foodType", name: "Food Type" },
    { id: "categories", name: "Categories" },
    { id: "price", name: "Price" },
    { id: "ratings", name: "Ratings" },
    { id: "prepTime", name: "Prep Time" },
    { id: "spiceLevel", name: "Spice Level" },
    { id: "bestSellers", name: "Best Sellers" },
    { id: "offers", name: "Offers" },
  ]

  const activeAd =
  advertisements.find(
    ad => ad.isActive
  )

  // LOADING
  if (loading) {
    return (
      <div className="fp-loading">
        <div className="fp-loading-inner">
          <div className="fp-spinner-wrap">
            <div className="fp-spinner"></div>
            <UtensilsCrossed className="fp-spinner-icon" />
          </div>
          <p className="fp-loading-text">Loading menu…</p>
        </div>
        <style>{`
          .fp-loading { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#fafaf9; }
          .fp-loading-inner { text-align:center; }
          .fp-spinner-wrap { position:relative; width:64px; height:64px; margin:0 auto 16px; }
          .fp-spinner { width:64px; height:64px; border:3px solid #f0ede8; border-top-color:#c84b2f; border-radius:50%; animation:fp-spin 0.9s linear infinite; }
          .fp-spinner-icon { position:absolute; inset:0; margin:auto; width:24px; height:24px; color:#c84b2f; }
          .fp-loading-text { font-size:14px; color:#9a8f85; font-family:'DM Sans',sans-serif; letter-spacing:0.02em; }
          @keyframes fp-spin { to { transform:rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  // ── FOOD CARD (shared) ──
  const FoodCard = ({ food }) => {
    const cartItem = cart.find((item) => item._id === food._id)
    const isFav = favorites.find((item) => item._id === food._id)
    return (
      <div className="fp-food-card">
        <div className="fp-food-img-wrap">
          <img
            src={`${import.meta.env.VITE_API_URL}${food.image}`}
            alt={food.name}
            loading="lazy"
          />
          <button
            className="fp-favorite-btn"
            onClick={() => toggleFavorite(food)}
          >
            <Heart
              size={14}
              fill={isFav ? "#ef4444" : "transparent"}
              color={isFav ? "#ef4444" : "white"}
            />
          </button>
          {food.isPopular && (
            <div className="fp-bestseller-tag">
              <Award size={9} /> Best
            </div>
          )}
        </div>
        <div className="fp-food-info">
          <div className="fp-food-name">{food.name}</div>
          <div className="fp-food-meta">
            <span className="fp-food-meta-item">
              <Star
                size={10}
                style={{ fill: "#f59e0b", color: "#f59e0b" }}
              />
              {food.rating || 4.5}
            </span>
            <span className="fp-food-meta-sep">·</span>
            <span className="fp-food-meta-item">
              <Clock size={10} />
              {food.prepTime || 20}m
            </span>
          </div>
          <div className="fp-food-footer">
            <span className="fp-food-price">₹{food.price}</span>
            {cartItem ? (
              <div className="fp-qty-ctrl">
                <button
                  className="fp-qty-btn"
                  onClick={() =>
                    updateQuantity(food._id, cartItem.quantity - 1)
                  }
                >
                  <Minus size={10} />
                </button>
                <span className="fp-qty-num">{cartItem.quantity}</span>
                <button
                  className="fp-qty-btn"
                  onClick={() =>
                    updateQuantity(food._id, cartItem.quantity + 1)
                  }
                >
                  <Plus size={10} />
                </button>
              </div>
            ) : (
              <button
                className="fp-add-btn"
                onClick={() => addToCart(food)}
              >
                <Plus size={11} /> Add
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── DESKTOP RIGHT PANEL CONTENT ──
  const renderDesktopPanelContent = () => {
    if (desktopPanel === "orders") {
      return (
        <div className="dp-panel-scroll">
          {activeOrders.length === 0 ? (
            <div className="dp-panel-empty">
              <div className="dp-panel-empty-icon">
                <ClipboardList size={28} />
              </div>
              <p>No orders yet</p>
              <small>Your placed orders will appear here</small>
            </div>
          ) : (
            <>
              {activeOrders.map((order) => (
                <div key={order._id || order.orderId} className="dp-order-card">
                  <div className="dp-order-header">
                    <div>
                      <div className="dp-order-id">
                        <Receipt size={13} /> #{order.orderId}
                      </div>
                      <div className="dp-order-meta">
                        {order.items?.length || 0} items
                      </div>
                    </div>
                    <span
                      className={`dp-status-pill ${
                        order.status === "completed"
                          ? "dp-status-completed"
                          : order.status === "preparing"
                          ? "dp-status-preparing"
                          : "dp-status-pending"
                      }`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>
                  <div className="dp-order-divider" />
                  {order.items?.map((item) => (
                    <div
                      key={`${item.name}-${item.price}`}
                      className="dp-order-item-row"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <strong>₹{item.price * item.quantity}</strong>
                    </div>
                  ))}
                  <div className="dp-order-divider" />
                  <div className="dp-order-total">
                    <span>Total</span>
                    <strong>₹{order.totalAmount || order.total}</strong>
                  </div>
                </div>
              ))}
              <div className="dp-grand-total">
                <span>Grand Total</span>
                <strong>₹{combinedBillTotal}</strong>
              </div>
            </>
          )}
        </div>
      )
    }

    if (desktopPanel === "favorites") {
      return (
        <div className="dp-panel-scroll">
          {favorites.length === 0 ? (
            <div className="dp-panel-empty">
              <div className="dp-panel-empty-icon">
                <Heart size={28} />
              </div>
              <p>No favorites yet</p>
              <small>Tap ♥ on any dish to save it here</small>
            </div>
          ) : (
            favorites.map((food) => {
              const cartItem = cart.find((item) => item._id === food._id)
              return (
                <div key={food._id} className="dp-fav-item">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${food.image}`}
                    alt={food.name}
                    loading="lazy"
                  />
                  <div className="dp-fav-info">
                    <div className="dp-fav-name">{food.name}</div>
                    <div className="dp-fav-cat">{food.category?.name}</div>
                    <div className="dp-fav-price">₹{food.price}</div>
                    <div className="dp-fav-actions">
                      {cartItem ? (
                        <div className="fp-qty-ctrl">
                          <button
                            className="fp-qty-btn"
                            onClick={() =>
                              updateQuantity(food._id, cartItem.quantity - 1)
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
                              updateQuantity(food._id, cartItem.quantity + 1)
                            }
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="fp-add-btn"
                          onClick={() => addToCart(food)}
                        >
                          <Plus size={11} /> Add
                        </button>
                      )}
                      <button
                        className="dp-remove-btn"
                        onClick={() => toggleFavorite(food)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )
    }

    if (desktopPanel === "call") {
      return (
        <div className="dp-panel-form">
          <div className="dp-form-icon">
            <Phone size={22} />
          </div>
          <p className="dp-form-subtitle">
            Request assistance at your table
          </p>
          <div className="dp-form-fields">
            <input
              type="text"
              className="dp-input"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value)
                localStorage.setItem("customerName", e.target.value)
              }}
            />
            {tableId ? (
              <div className="dp-table-display">
                <Users size={14} />
                <span>Table #{tableId}</span>
              </div>
            ) : (
              <input
                type="number"
                className="dp-input"
                placeholder="Table Number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            )}
          </div>
          <div className="dp-form-actions">
            <button
              className="dp-btn-outline"
              onClick={() => setDesktopPanel(null)}
            >
              Cancel
            </button>
            <button
              className="dp-btn-primary"
              onClick={async () => {
                await handleCallWaiter()
                setDesktopPanel(null)
              }}
            >
              {isCalling ? "Calling…" : "Call Waiter"}
            </button>
          </div>
        </div>
      )
    }

    if (desktopPanel === "cart") {
      return (
        <>
          <div className="dp-panel-scroll">
            {cart.length === 0 ? (
              <div className="dp-panel-empty">
                <div className="dp-panel-empty-icon">
                  <ShoppingBag size={28} />
                </div>
                <p>Your cart is empty</p>
                <small>Add delicious items from our menu</small>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item._id} className="dp-cart-item">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${item.image}`}
                    alt={item.name}
                    loading="lazy"
                  />
                  <div className="dp-cart-item-info">
                    <div className="dp-cart-item-name">{item.name}</div>
                    <div className="dp-cart-item-sub">
                      {item.isVeg ? "Veg" : "Non-Veg"}
                    </div>
                    <div className="dp-cart-item-price">
                      ₹{Number(item.price) * Number(item.quantity)}
                    </div>
                    <div className="dp-cart-item-actions">
                      <div className="fp-qty-ctrl">
                        <button
                          className="fp-qty-btn"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                        >
                          <Minus size={10} />
                        </button>
                        <span className="fp-qty-num">{item.quantity}</span>
                        <button
                          className="fp-qty-btn"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <button
                        className="dp-remove-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="dp-cart-footer">
              <div className="dp-cart-total-row">
                <span>Total</span>
                <strong>₹{getCartTotal()}</strong>
              </div>
              <button
                className="dp-checkout-btn"
                onClick={() => setShowTableModal(true)}
              >
                <span>Place Order</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )
    }

    if (desktopPanel === "info") {
      return (
        <div className="dp-panel-scroll">
          <div className="dp-info-hero">
            <div className="dp-info-logo">
              <UtensilsCrossed size={24} />
            </div>
            <div>
              <h3>Aura Kitchen</h3>
              <p>Premium Dining Experience</p>
            </div>
          </div>
          {[
            { icon: <Star size={15} />, label: "Rating", value: "4.8 / 5.0" },
            {
              icon: <MapPin size={15} />,
              label: "Address",
              value: "Main Street, Coimbatore",
            },
            {
              icon: <Clock3 size={15} />,
              label: "Hours",
              value: "10:00 AM – 11:00 PM",
            },
            {
              icon: <Phone size={15} />,
              label: "Phone",
              value: "+91 9876543210",
            },
            {
              icon: <Mail size={15} />,
              label: "Email",
              value: "foodie@gmail.com",
            },
            {
              icon: <Globe size={15} />,
              label: "Website",
              value: "www.foodie.com",
            },
            {
              icon: <ShieldCheck size={15} />,
              label: "Services",
              value: "Dine-In · Takeaway · Delivery",
            },
          ].map((item, i) => (
            <div key={i} className="dp-info-row">
              <div className="dp-info-icon">{item.icon}</div>
              <div>
                <div className="dp-info-label">{item.label}</div>
                <div className="dp-info-value">{item.value}</div>
              </div>
            </div>
          ))}
          <div className="dp-info-about">
            <h4>About Us</h4>
            <p>
              Aura Kitchen is dedicated to delivering high-quality food with
              exceptional customer service and a memorable dining experience.
            </p>
          </div>
        </div>
      )
    }

    return null
  }

  const panelMeta = {
    orders: { icon: <ClipboardList size={16} />, title: "Your Orders" },
    favorites: { icon: <Heart size={16} />, title: "Favourites" },
    call: { icon: <Phone size={16} />, title: "Call Waiter" },
    cart: { icon: <ShoppingBag size={16} />, title: "Your Cart" },
    info: { icon: <Building2 size={16} />, title: "Restaurant Info" },
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Playfair+Display:wght@500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --fp-bg: #f5f2ed;
          --fp-surface: #ffffff;
          --fp-border: #e8e3db;
          --fp-accent: #c84b2f;
          --fp-accent-dark: #a83a20;
          --fp-accent-light: #fdf1ee;
          --fp-accent-mid: #f0c4b8;
          --fp-gold: #c9964a;
          --fp-text: #1c1814;
          --fp-muted: #7a6e65;
          --fp-hint: #b5aca3;
          --fp-success: #2d7a4f;
          --fp-success-bg: #edf6f1;
          --fp-overlay: rgba(28,24,20,0.55);
          --fp-font-body: 'DM Sans', sans-serif;
          --fp-font-display: 'Playfair Display', serif;
          --fp-radius-sm: 8px;
          --fp-radius-md: 12px;
          --fp-radius-lg: 18px;
          --fp-radius-xl: 24px;
          --fp-shadow-sm: 0 1px 3px rgba(28,24,20,0.06), 0 2px 8px rgba(28,24,20,0.04);
          --fp-shadow: 0 2px 8px rgba(28,24,20,0.08), 0 6px 20px rgba(28,24,20,0.06);
          --fp-shadow-lg: 0 8px 32px rgba(28,24,20,0.14);
        }

        /* ─────────── SHARED FOOD CARD ─────────── */
        .fp-food-card {
          background: var(--fp-surface);
          border-radius: var(--fp-radius-md);
          overflow: hidden;
          box-shadow: var(--fp-shadow-sm);
          border: 1px solid var(--fp-border);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .fp-food-card:hover { transform: translateY(-2px); box-shadow: var(--fp-shadow); }
        .fp-food-img-wrap { position: relative; overflow: hidden; }
        .fp-food-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; display: block; }
        .fp-food-card:hover .fp-food-img-wrap img { transform: scale(1.04); }
        .fp-favorite-btn {
          position: absolute; top: 7px; right: 7px;
          width: 28px; height: 28px; border: none; border-radius: 50%;
          background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: transform 0.2s; z-index: 2;
        }
        .fp-favorite-btn:hover { transform: scale(1.1); }
        .fp-bestseller-tag {
          position: absolute; top: 7px; left: 7px;
          display: flex; align-items: center; gap: 3px;
          background: var(--fp-gold); color: #fff;
          font-size: 10px; font-weight: 700; padding: 3px 6px; border-radius: 20px;
          font-family: var(--fp-font-body);
        }
        .fp-food-info { padding: 10px 10px 11px; }
        .fp-food-name { font-weight: 600; font-size: 13px; color: var(--fp-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--fp-font-body); }
        .fp-food-meta { display: flex; align-items: center; gap: 5px; margin-top: 3px; }
        .fp-food-meta-item { display: flex; align-items: center; gap: 2px; font-size: 11px; color: var(--fp-muted); font-family: var(--fp-font-body); }
        .fp-food-meta-sep { color: var(--fp-hint); font-size: 9px; }
        .fp-food-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
        .fp-food-price { font-family: var(--fp-font-display); font-size: 15px; font-weight: 600; color: var(--fp-accent); }
        .fp-add-btn {
          display: flex; align-items: center; gap: 3px;
          background: var(--fp-accent-light); color: var(--fp-accent);
          border: 1px solid var(--fp-accent-mid); border-radius: 20px;
          padding: 4px 10px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.18s; font-family: var(--fp-font-body);
        }
        .fp-add-btn:hover { background: var(--fp-accent); color: #fff; border-color: var(--fp-accent); }
        .fp-qty-ctrl { display: flex; align-items: center; gap: 5px; background: var(--fp-accent-light); border-radius: 20px; padding: 2px 5px; }
        .fp-qty-btn {
          width: 20px; height: 20px; border-radius: 50%; background: #fff;
          border: 1px solid var(--fp-accent-mid); display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--fp-accent); transition: all 0.15s;
        }
        .fp-qty-btn:hover { background: var(--fp-accent); color: #fff; border-color: var(--fp-accent); }
        .fp-qty-num { font-size: 12px; font-weight: 700; color: var(--fp-accent); min-width: 14px; text-align: center; font-family: var(--fp-font-body); }

        /* ─────────── MOBILE / TABLET STYLES ─────────── */
        .fp-root { font-family: var(--fp-font-body); background: var(--fp-bg); min-height: 100vh; color: var(--fp-text); -webkit-font-smoothing: antialiased; }

        /* Welcome */
        .fp-welcome {
          position: fixed; inset: 0; z-index: 100; background: var(--fp-accent);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          animation: fp-welcome-exit 0.6s ease-in-out 3.4s forwards;
        }
        .fp-welcome-logo { width: 80px; height: 80px; background: #fff; border-radius: 22px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; animation: fp-logo-pulse 2s ease-in-out infinite; }
        .fp-welcome-logo svg { color: var(--fp-accent); width: 36px; height: 36px; }
        .fp-welcome h1 { font-family: var(--fp-font-display); color: #fff; font-size: 30px; font-weight: 600; }
        .fp-welcome p { color: rgba(255,255,255,0.75); font-size: 14px; margin-top: 6px; letter-spacing: 0.08em; text-transform: uppercase; }
        .fp-welcome-dots { display: flex; gap: 6px; margin-top: 36px; }
        .fp-welcome-dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.5); }
        .fp-welcome-dots span:nth-child(1) { animation: fp-dot-bounce 1.2s 0s infinite; }
        .fp-welcome-dots span:nth-child(2) { animation: fp-dot-bounce 1.2s 0.15s infinite; }
        .fp-welcome-dots span:nth-child(3) { animation: fp-dot-bounce 1.2s 0.3s infinite; }

        /* Toast */
        .fp-toast {
          position: fixed; top: 16px; left: 12px; right: 12px; z-index: 200;
          background: var(--fp-success); border-radius: var(--fp-radius-md);
          padding: 14px 16px; display: flex; align-items: center; gap: 12px;
          box-shadow: var(--fp-shadow-lg); animation: fp-slide-down 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .fp-toast-icon { color: #fff; flex-shrink: 0; }
        .fp-toast h4 { color: #fff; font-size: 14px; font-weight: 600; }
        .fp-toast p { color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 1px; }

        /* Header mobile */
        .fp-header { position: sticky; top: 0; z-index: 40; background: var(--fp-surface); border-bottom: 1px solid var(--fp-border); padding: 12px 16px; }
        .fp-header-inner { display: flex; align-items: center; justify-content: space-between; }
        .fp-brand { display: flex; align-items: center; gap: 10px; }
        .fp-brand-icon { width: 40px; height: 40px; background: var(--fp-accent); border-radius: var(--fp-radius-sm); display: flex; align-items: center; justify-content: center; position: relative; }
        .fp-brand-icon svg { color: #fff; width: 18px; height: 18px; }
        .fp-brand-dot { position: absolute; top: -3px; right: -3px; width: 10px; height: 10px; background: #2ecc71; border-radius: 50%; border: 2px solid #fff; }
        .fp-brand-name { font-family: var(--fp-font-display); font-size: 17px; font-weight: 600; color: var(--fp-text); }
        .fp-brand-meta { display: flex; align-items: center; gap: 6px; margin-top: 1px; }
        .fp-brand-meta span { font-size: 11px; color: var(--fp-muted); display: flex; align-items: center; gap: 2px; }
        .fp-cart-btn { position: relative; width: 40px; height: 40px; background: var(--fp-accent-light); border: 1px solid var(--fp-accent-mid); border-radius: var(--fp-radius-sm); display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; }
        .fp-cart-btn svg { color: var(--fp-accent); width: 18px; height: 18px; }

        /* Body mobile */
        .fp-body { padding: 0 16px 100px; }

        /* Banner */
        .fp-banner-wrap { margin-top: 16px; border-radius: var(--fp-radius-lg); overflow: hidden; position: relative; height: 160px; box-shadow: var(--fp-shadow); }
        .fp-banner-slide { position: absolute; inset: 0; transition: opacity 0.55s ease; }
        .fp-banner-slide img { width: 100%; height: 100%; object-fit: cover; }
        .fp-banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,12,5,0.75) 0%, transparent 55%); }
        .fp-banner-text { position: absolute; bottom: 0; left: 0; right: 0; padding: 14px 16px; }
        .fp-banner-text h2 { color: #fff; font-family: var(--fp-font-display); font-size: 18px; font-weight: 600; }
        .fp-banner-text p { color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 2px; }
        .fp-banner-dots { position: absolute; bottom: 10px; right: 14px; display: flex; gap: 5px; z-index: 5; }
        .fp-banner-dot { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.5); transition: all 0.3s; cursor: pointer; border: none; padding: 0; }
        .fp-banner-dot.active { width: 18px; background: #fff; }
        .fp-banner-dot:not(.active) { width: 4px; }

        /* Search */
        .fp-search-row { display: flex; gap: 10px; margin-top: 16px; }
        .fp-search-wrap { flex: 1; position: relative; }
        .fp-search-wrap svg { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: var(--fp-hint); pointer-events: none; }
        .fp-search-input { width: 100%; height: 42px; padding: 0 12px 0 36px; background: var(--fp-surface); border: 1px solid var(--fp-border); border-radius: var(--fp-radius-md); font-size: 14px; font-family: var(--fp-font-body); color: var(--fp-text); outline: none; transition: border-color 0.2s; }
        .fp-search-input:focus { border-color: var(--fp-accent-mid); }
        .fp-filter-btn { width: 42px; height: 42px; background: var(--fp-accent); border-radius: var(--fp-radius-md); display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; position: relative; flex-shrink: 0; }
        .fp-filter-btn svg { color: #fff; width: 16px; height: 16px; }
        .fp-filter-badge { position: absolute; top: -6px; right: -6px; min-width: 18px; height: 18px; padding: 0 4px; background: var(--fp-gold); color: #fff; font-size: 10px; font-weight: 700; border-radius: 9px; border: 2px solid var(--fp-bg); display: flex; align-items: center; justify-content: center; }

        /* Categories */
        .fp-section-title { font-size: 12px; font-weight: 600; color: var(--fp-muted); letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 10px; }
        .fp-categories-section { margin-top: 20px; }
        .fp-categories-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .fp-categories-scroll::-webkit-scrollbar { display: none; }
        .fp-cat-pill { flex-shrink: 0; display: flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 50px; border: 1px solid var(--fp-border); background: var(--fp-surface); font-size: 12px; font-weight: 500; color: var(--fp-muted); cursor: pointer; transition: all 0.18s; white-space: nowrap; font-family: var(--fp-font-body); }
        .fp-cat-pill:hover { border-color: var(--fp-accent-mid); color: var(--fp-accent); }
        .fp-cat-pill.active { background: var(--fp-accent); border-color: var(--fp-accent); color: #fff; box-shadow: 0 2px 8px rgba(200,75,47,0.28); }

        /* Special */
        .fp-special-section { margin-top: 22px; }
        .fp-special-section-head { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
        .fp-special-card { border-radius: var(--fp-radius-lg); overflow: hidden; position: relative; height: 200px; box-shadow: var(--fp-shadow); }
        .fp-special-card img { width: 100%; height: 100%; object-fit: cover; transition: opacity 0.5s; }
        .fp-special-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, transparent 30%, rgba(20,12,5,0.8) 100%); }
        .fp-special-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 14px; }
        .fp-special-badges { display: flex; gap: 6px; margin-bottom: 5px; }
        .fp-badge { display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; font-family: var(--fp-font-body); }
        .fp-badge-gold { background: var(--fp-gold); color: #fff; }
        .fp-badge-ghost { background: rgba(255,255,255,0.18); backdrop-filter: blur(4px); color: #fff; border: 1px solid rgba(255,255,255,0.25); }
        .fp-special-name { font-family: var(--fp-font-display); color: #fff; font-size: 20px; font-weight: 600; }
        .fp-special-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
        .fp-special-price { font-family: var(--fp-font-display); color: #fff; font-size: 22px; font-weight: 600; }
        .fp-special-add-btn { background: #fff; color: var(--fp-accent); border: none; border-radius: 50px; padding: 8px 18px; font-size: 13px; font-weight: 600; font-family: var(--fp-font-body); cursor: pointer; transition: all 0.18s; }
        .fp-special-add-btn:hover { background: var(--fp-accent); color: #fff; }
        .fp-special-dots { display: flex; justify-content: center; gap: 5px; margin-top: 10px; }
        .fp-special-dot { height: 3px; border-radius: 2px; cursor: pointer; background: none; border: none; padding: 0; transition: all 0.3s; }
        .fp-special-dot.active { width: 16px; background: var(--fp-accent); }
        .fp-special-dot:not(.active) { width: 4px; background: var(--fp-border); }

        /* Menu grid */
        .fp-menu-section { margin-top: 22px; }
        .fp-menu-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .fp-menu-count { font-size: 12px; color: var(--fp-hint); font-family: var(--fp-font-body); }
        .fp-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        @media(min-width: 600px) { .fp-grid { grid-template-columns: repeat(3, 1fr); } }
        .fp-food-img-wrap { height: 120px; }

        /* Empty */
        .fp-empty { background: var(--fp-surface); border: 1px solid var(--fp-border); border-radius: var(--fp-radius-lg); padding: 48px 24px; text-align: center; }
        .fp-empty-emoji { font-size: 40px; margin-bottom: 12px; }
        .fp-empty p { color: var(--fp-muted); font-size: 14px; }
        .fp-empty-clear { margin-top: 12px; color: var(--fp-accent); font-size: 13px; font-weight: 600; background: none; border: none; cursor: pointer; font-family: var(--fp-font-body); }

        /* Floating cart mobile */
        .fp-floating-cart { position: fixed; bottom: 72px; left: 50%; transform: translateX(-50%); width: calc(100% - 32px); max-width: 420px; z-index: 35; }
        .fp-floating-cart-btn { width: 100%; background: var(--fp-accent); border-radius: var(--fp-radius-lg); padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border: none; box-shadow: 0 8px 32px rgba(28,24,20,0.35); }
        .fp-floating-cart-left { display: flex; align-items: center; gap: 12px; }
        .fp-floating-cart-icon { width: 36px; height: 36px; background: rgba(255,255,255,0.12); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .fp-floating-cart-icon svg { color: #fff; width: 16px; height: 16px; }
        .fp-floating-cart-label { color: #fff; font-size: 13px; font-weight: 600; }
        .fp-floating-cart-sublabel { color: rgba(255,255,255,0.6); font-size: 11px; }
        .fp-floating-cart-total { font-family: var(--fp-font-display); color: #fff; font-size: 18px; font-weight: 600; }
        .fp-floating-cart-cta { display: flex; align-items: center; gap: 2px; color: rgba(255,255,255,0.6); font-size: 11px; justify-content: flex-end; }

        /* Bottom nav mobile */
        .fp-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; z-index: 40; background: var(--fp-surface); border-top: 1px solid var(--fp-border); padding: 6px 0 8px; }
        .fp-nav-inner { display: flex; justify-content: space-around; }
        .fp-nav-btn { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 14px; background: none; border: none; cursor: pointer; position: relative; }
        .fp-nav-btn svg { width: 20px; height: 20px; color: var(--fp-hint); }
        .fp-nav-btn.active svg { color: var(--fp-accent); }
        .fp-nav-label { font-size: 10px; font-weight: 500; color: var(--fp-hint); font-family: var(--fp-font-body); }
        .fp-nav-btn.active .fp-nav-label { color: var(--fp-accent); }
        .fp-nav-indicator { position: absolute; bottom: -6px; width: 18px; height: 2px; background: var(--fp-accent); border-radius: 1px; }

        /* Overlays */
        .fp-overlay { position: fixed; inset: 0; z-index: 50; background: var(--fp-overlay); backdrop-filter: blur(3px); animation: fp-fade-in 0.25s; }
        .fp-sheet { position: absolute; bottom: 0; left: 0; right: 0; background: var(--fp-surface); border-radius: var(--fp-radius-xl) var(--fp-radius-xl) 0 0; animation: fp-slide-up 0.35s cubic-bezier(0.22,1,0.36,1); max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; }
        .fp-sheet-handle { width: 36px; height: 4px; background: var(--fp-border); border-radius: 2px; margin: 10px auto 0; }
        .fp-sheet-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 12px; border-bottom: 1px solid var(--fp-border); }
        .fp-sheet-title { font-family: var(--fp-font-display); font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .fp-sheet-title svg { width: 18px; height: 18px; color: var(--fp-accent); }
        .fp-sheet-close { width: 32px; height: 32px; background: var(--fp-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; }
        .fp-sheet-close svg { width: 16px; height: 16px; color: var(--fp-muted); }
        .fp-sheet-footer { padding: 14px 16px; border-top: 1px solid var(--fp-border); display: flex; gap: 10px; }
        .fp-sheet-scroll { flex: 1; overflow-y: auto; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
        .fp-btn-outline { flex: 1; padding: 12px; border: 1px solid var(--fp-border); border-radius: var(--fp-radius-md); font-size: 14px; font-weight: 600; color: var(--fp-muted); background: none; cursor: pointer; font-family: var(--fp-font-body); }
        .fp-btn-primary { flex: 1; padding: 12px; background: var(--fp-accent); border: none; border-radius: var(--fp-radius-md); font-size: 14px; font-weight: 600; color: #fff; cursor: pointer; font-family: var(--fp-font-body); }

        /* Filter sheet mobile */
        .fp-filter-body { display: flex; flex: 1; overflow: hidden; }
        .fp-filter-sidebar { width: 38%; background: var(--fp-bg); overflow-y: auto; border-right: 1px solid var(--fp-border); }
        .fp-filter-sidebar-btn { width: 100%; text-align: left; padding: 13px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: var(--fp-muted); font-family: var(--fp-font-body); position: relative; transition: all 0.15s; }
        .fp-filter-sidebar-btn.active { background: var(--fp-surface); color: var(--fp-accent); font-weight: 600; border-left: 3px solid var(--fp-accent); }
        .fp-filter-panel { width: 62%; overflow-y: auto; padding: 16px; }
        .fp-filter-group-title { font-size: 13px; font-weight: 600; color: var(--fp-text); margin-bottom: 12px; }
        .fp-filter-option { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--fp-border); cursor: pointer; }
        .fp-filter-option:last-child { border-bottom: none; }
        .fp-filter-option-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--fp-text); font-family: var(--fp-font-body); }
        .fp-filter-radio, .fp-filter-check { width: 16px; height: 16px; accent-color: var(--fp-accent); cursor: pointer; }

        /* Cart drawer mobile */
        .fp-cart-drawer { position: absolute; right: 0; top: 0; bottom: 0; width: 100%; max-width: 420px; background: var(--fp-surface); display: flex; flex-direction: column; animation: fp-slide-in-right 0.3s cubic-bezier(0.22,1,0.36,1); }
        .fp-cart-header { background: var(--fp-accent); padding: 18px 18px 16px; flex-shrink: 0; }
        .fp-cart-header-inner { display: flex; align-items: flex-start; justify-content: space-between; }
        .fp-cart-title { font-family: var(--fp-font-display); color: #fff; font-size: 22px; font-weight: 600; }
        .fp-cart-subtitle { color: rgba(255,255,255,0.7); font-size: 13px; margin-top: 2px; }
        .fp-cart-close { width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; }
        .fp-cart-close svg { color: #fff; width: 16px; height: 16px; }
        .fp-cart-items { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
        .fp-cart-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 40px; text-align: center; }
        .fp-cart-empty-icon { width: 64px; height: 64px; background: var(--fp-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .fp-cart-empty-icon svg { width: 28px; height: 28px; color: var(--fp-hint); }
        .fp-cart-empty p { color: var(--fp-muted); font-size: 14px; font-weight: 500; }
        .fp-cart-empty small { color: var(--fp-hint); font-size: 12px; }
        .fp-cart-item { display: flex; align-items: center; gap: 12px; background: var(--fp-bg); border-radius: 14px; padding: 10px; border: 1px solid var(--fp-border); }
        .fp-cart-item img { width: 65px; height: 65px; object-fit: cover; border-radius: var(--fp-radius-sm); flex-shrink: 0; }
        .fp-cart-item-info { flex: 1; min-width: 0; }
        .fp-cart-item-name { font-weight: 600; font-size: 13px; color: var(--fp-text); }
        .fp-cart-item-sub { font-size: 11px; color: var(--fp-muted); margin-top: 2px; }
        .fp-cart-item-price { font-family: var(--fp-font-display); font-size: 15px; font-weight: 600; color: var(--fp-accent); margin-top: 3px; }
        .fp-cart-item-actions { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
        .fp-cart-remove { display: flex; align-items: center; gap: 3px; font-size: 11px; color: #e74c3c; background: none; border: none; cursor: pointer; font-family: var(--fp-font-body); }
        .fp-cart-footer { padding: 14px; border-top: 1px solid var(--fp-border); }
        .fp-checkout-btn { width: 100%; background: var(--fp-accent); color: #fff; border: none; border-radius: 14px; padding: 14px 18px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-family: var(--fp-font-body); }

        /* Modal */
        .fp-modal-wrap { position: fixed; inset: 0; z-index: 60; background: var(--fp-overlay); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fp-fade-in 0.2s; }
        .fp-modal { background: var(--fp-surface); border-radius: var(--fp-radius-xl); padding: 28px 24px 24px; width: 100%; max-width: 380px; animation: fp-scale-in 0.25s cubic-bezier(0.22,1,0.36,1); }
        .fp-modal-icon { width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
        .fp-modal-icon-accent { background: var(--fp-accent-light); }
        .fp-modal-icon-accent svg { color: var(--fp-accent); width: 24px; height: 24px; }
        .fp-modal-title { font-family: var(--fp-font-display); font-size: 20px; font-weight: 600; text-align: center; }
        .fp-modal-subtitle { font-size: 13px; color: var(--fp-muted); text-align: center; margin-top: 4px; }
        .fp-modal-inputs { display: flex; flex-direction: column; gap: 10px; margin-top: 18px; }
        .fp-input { width: 100%; padding: 11px 14px; border: 1px solid var(--fp-border); border-radius: var(--fp-radius-md); font-size: 14px; font-family: var(--fp-font-body); color: var(--fp-text); outline: none; transition: border-color 0.2s; }
        .fp-input:focus { border-color: var(--fp-accent-mid); }
        .fp-input::placeholder { color: var(--fp-hint); }
        .fp-table-display { padding: 11px 14px; background: var(--fp-bg); border-radius: var(--fp-radius-md); border: 1px solid var(--fp-border); display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; }
        .fp-table-display svg { width: 15px; height: 15px; color: var(--fp-muted); }
        .fp-modal-actions { display: flex; gap: 10px; margin-top: 18px; }

        /* Mobile order cards */
        .fp-order-card { background: #fff; border: 2px dashed var(--fp-border); border-radius: 18px; padding: 16px; margin-bottom: 14px; }
        .fp-order-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .fp-order-id { display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--fp-text); font-family: var(--fp-font-body); }
        .fp-order-time { font-size: 12px; color: var(--fp-muted); margin-top: 3px; }
        .fp-order-divider { height: 1px; background: repeating-linear-gradient(to right, var(--fp-border) 0, var(--fp-border) 8px, transparent 8px, transparent 14px); margin: 12px 0; }
        .fp-order-item-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; font-family: var(--fp-font-body); }
        .fp-order-total { display: flex; justify-content: space-between; align-items: center; font-size: 15px; font-weight: 700; font-family: var(--fp-font-body); }
        .fp-order-total strong { color: var(--fp-accent); font-size: 18px; }
        .fp-status-pill { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: capitalize; font-family: var(--fp-font-body); }
        .fp-status-pending { background: #fff8e6; color: #b8740a; }
        .fp-status-preparing { background: #e6f0ff; color: #2052a3; }
        .fp-status-completed { background: var(--fp-success-bg); color: var(--fp-success); }
        .fp-grand-total-card { background: var(--fp-accent); border-radius: 18px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
        .fp-grand-total-label { color: #fff; font-size: 14px; font-weight: 600; }
        .fp-grand-total-amount { font-family: var(--fp-font-display); color: #fff; font-size: 28px; font-weight: 700; }
        .fp-orders-summary { display: flex; align-items: center; gap: 12px; background: var(--fp-accent-light); border: 1px solid var(--fp-accent-mid); border-radius: 14px; padding: 14px; margin-bottom: 14px; }
        .fp-orders-summary h3 { font-size: 15px; font-weight: 700; }
        .fp-orders-summary p { font-size: 12px; color: var(--fp-muted); margin-top: 2px; }
        .fp-info-hero { display: flex; align-items: center; gap: 14px; background: var(--fp-accent-light); border: 1px solid var(--fp-accent-mid); border-radius: 16px; padding: 16px; margin-bottom: 14px; }
        .fp-info-logo { width: 54px; height: 54px; border-radius: 14px; background: var(--fp-accent); display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
        .fp-info-hero h3 { font-size: 17px; font-weight: 700; }
        .fp-info-hero p { font-size: 12px; color: var(--fp-muted); margin-top: 3px; }
        .fp-info-card { display: flex; align-items: flex-start; gap: 12px; padding: 14px; border-radius: 14px; background: white; border: 1px solid var(--fp-border); margin-bottom: 10px; }
        .fp-info-icon { width: 38px; height: 38px; border-radius: 10px; background: var(--fp-accent-light); color: var(--fp-accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .fp-info-label { font-size: 11px; font-weight: 600; color: var(--fp-muted); margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.05em; }
        .fp-info-value { font-size: 13px; font-weight: 600; color: var(--fp-text); }
        .fp-info-about { padding: 16px; background: white; border-radius: 14px; border: 1px solid var(--fp-border); }
        .fp-info-about h4 { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
        .fp-info-about p { font-size: 13px; line-height: 1.65; color: var(--fp-muted); }

        /* ═══════════════════════════════════════════════════════
           DESKTOP LAYOUT (≥ 1024px)
           ═══════════════════════════════════════════════════════ */

        @media(max-width: 1023px) {
          .dp-navbar { display: none !important; }
          .dp-layout { display: none !important; }
        }

        /* ── Desktop Navbar ── */
        .dp-navbar {
          position: sticky;
          top: 0;
          z-index: 60;
          height: 64px;
          background: var(--fp-accent);
          box-shadow: 0 2px 16px rgba(200,75,47,0.3);
        }
        .dp-navbar-inner {
          max-width: 1560px;
          margin: 0 auto;
          height: 100%;
          padding: 0 28px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        /* Logo */
        .dp-logo {
          display: flex;
          align-items: center;
          gap: 11px;
          flex-shrink: 0;
          padding-right: 20px;
          border-right: 1px solid rgba(255,255,255,0.18);
        }
        .dp-logo-icon {
          width: 38px;
          height: 38px;
          background: rgba(255,255,255,0.15);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dp-logo-icon svg { color: #fff; width: 18px; height: 18px; }
        .dp-logo-name {
          font-family: var(--fp-font-display);
          font-size: 19px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }
        .dp-logo-sub {
          font-size: 10px;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        /* Navbar search */
        .dp-nav-search {
          flex: 1;
          max-width: 440px;
          position: relative;
        }
        .dp-nav-search svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 15px;
          height: 15px;
          color: var(--fp-hint);
          pointer-events: none;
        }
        .dp-nav-search input {
          width: 100%;
          height: 38px;
          padding: 0 14px 0 38px;
          background: #fff;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-family: var(--fp-font-body);
          color: var(--fp-text);
          outline: none;
        }
        .dp-nav-search input::placeholder { color: var(--fp-hint); }

        /* Navbar right links */
        .dp-nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-left: auto;
        }
        .dp-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 7px 14px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
          position: relative;
          min-width: 62px;
          font-family: var(--fp-font-body);
        }
        .dp-nav-btn:hover { background: rgba(255,255,255,0.1); }
        .dp-nav-btn.dp-active { background: rgba(255,255,255,0.18); }
        .dp-nav-btn svg { color: rgba(255,255,255,0.9); width: 19px; height: 19px; }
        .dp-nav-btn-label {
          font-size: 10px;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          white-space: nowrap;
        }
        .dp-nav-badge {
          position: absolute;
          top: 4px;
          right: 8px;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          background: var(--fp-gold);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          border-radius: 9px;
          border: 2px solid var(--fp-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--fp-font-body);
        }

        /* ── Desktop Three-Column Layout ── */
        .dp-layout {
          display: flex;
          align-items: flex-start;
          max-width: 1560px;
          margin: 0 auto;
          padding: 20px 28px 40px;
          gap: 20px;
          min-height:auto;
        }

        /* ── LEFT SIDEBAR: Filters ── */
        .dp-sidebar {
          width: 250px;
          min-width: 250px;
          flex-shrink: 0;
          position: sticky;
          top: 84px;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--fp-border) transparent;
        }
        .dp-sidebar::-webkit-scrollbar { width: 3px; }
        .dp-sidebar::-webkit-scrollbar-thumb { background: var(--fp-border); border-radius: 2px; }

        .dp-filter-card {
          background: var(--fp-surface);
          border: 1px solid var(--fp-border);
          border-radius: var(--fp-radius-lg);
          overflow: hidden;
          box-shadow: var(--fp-shadow-sm);
        }
        .dp-filter-header {
          padding: 14px 16px;
          background: var(--fp-bg);
          border-bottom: 1px solid var(--fp-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dp-filter-header-left {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 700;
          color: var(--fp-text);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .dp-filter-header-left svg { color: var(--fp-accent); width: 14px; height: 14px; }
        .dp-filter-clear {
          font-size: 11px;
          font-weight: 600;
          color: var(--fp-accent);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--fp-font-body);
        }
        .dp-filter-clear:hover { text-decoration: underline; }

        /* Two-pane filter inside sidebar */
        .dp-filter-panes {
          display: flex;
          min-height: 420px;
        }
        .dp-filter-tabs {
          width: 100px;
          min-width: 100px;
          background: #faf9f7;
          border-right: 1px solid var(--fp-border);
          display: flex;
          flex-direction: column;
        }
        .dp-filter-tab {
          padding: 12px 10px;
          font-size: 11.5px;
          font-weight: 500;
          height: 58px;
          color: var(--fp-muted);
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          border-left: 3px solid transparent;
          transition: all 0.15s;
          font-family: var(--fp-font-body);
          line-height: 1.3;
        }
        .dp-filter-tab:hover { color: var(--fp-text); background: rgba(0,0,0,0.02); }
        .dp-filter-tab.dp-tab-active {
          background: #fff;
          color: var(--fp-accent);
          font-weight: 700;
          border-left-color: var(--fp-accent);
        }
        .dp-filter-options {
          flex: 1;
          overflow-y: auto;
          max-height: 420px;
          scrollbar-width: thin;
          scrollbar-color: var(--fp-border) transparent;
        }
        .dp-filter-options::-webkit-scrollbar { width: 3px; }
        .dp-filter-options::-webkit-scrollbar-thumb { background: var(--fp-border); border-radius: 2px; }
        .dp-filter-opt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 14px;
          border-bottom: 1px solid #f5f2ed;
          cursor: pointer;
          transition: background 0.12s;
          height: auto;
          
        }
        .dp-filter-opt:last-child { border-bottom: none; }
        .dp-filter-opt:hover { background: #fdf9f7; }
        .dp-filter-opt.dp-opt-checked { background: #fff8f6; }
        .dp-filter-opt span {
          font-size: 12.5px;
          color: var(--fp-text);
          font-weight: 500;
          font-family: var(--fp-font-body);
          flex: 1;
          padding-right: 8px;
        }
        .dp-filter-opt input {
          width: 15px;
          height: 15px;
          accent-color: var(--fp-accent);
          cursor: pointer;
          flex-shrink: 0;
        }

        /* ── CENTER CONTENT ── */
        .dp-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* Desktop banner */
        .dp-content .fp-banner-wrap {
          height: 280px;
          margin-top: 0;
          border-radius: var(--fp-radius-lg);
        }
        .dp-content .fp-banner-text h2 { font-size: 26px; }
        .dp-content .fp-banner-text p { font-size: 14px; }

        /* Desktop categories — wrap, no scroll */
        .dp-content .fp-categories-section { margin-top: 0; 
   }
        .dp-content .fp-categories-scroll {
          display: flex;
  flex-wrap: nowrap;           /* Changed from wrap to nowrap */
  overflow-x: auto;            /* Enable horizontal scroll */
  overflow-y: hidden;
  gap: 8px;
  padding-bottom: 8px;         /* Space for scrollbar */
  scrollbar-width: none;       /* Nice thin scrollbar */
-webkit-scrollbar { display: none; } /* Hide scrollbar in WebKit browsers */
-ms-overflow-style: none;  /* Hide scrollbar in IE and Edge */
        }

        /* Custom scrollbar styling */
.dp-content .fp-categories-scroll::-webkit-scrollbar {
  display: none;
}

.dp-content .fp-categories-scroll::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.dp-content .fp-categories-scroll::-webkit-scrollbar-thumb {
  background: var(--fp-border);
  border-radius: 4px;
}

.dp-content .fp-categories-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--fp-accent-mid);
}

/* Keep category pills as nowrap */
.dp-content .fp-cat-pill {
  flex-shrink: 0;              /* Prevent pills from shrinking */
  white-space: nowrap;
}


        /* Desktop special */
        .dp-content .fp-special-section { margin-top: 0; }
        .dp-content .fp-special-card { height: 230px; }

        /* Desktop menu */
        .dp-content .fp-menu-section { margin-top: 0; }
        .dp-content .fp-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .dp-content .fp-food-img-wrap { height: 140px; }

        /* When panel open, shrink to 2 cols */
        .dp-layout.dp-has-panel .dp-content .fp-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        @media(min-width: 1400px) {
          .dp-layout.dp-has-panel .dp-content .fp-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* ── RIGHT PANEL ── */
        .dp-right-panel {
          width: 310px;
          min-width: 310px;
          flex-shrink: 0;
          position: sticky;
          top: 84px;
          max-height: calc(100vh - 100px);
          display: flex;
          flex-direction: column;
          background: var(--fp-surface);
          border: 1px solid var(--fp-border);
          border-radius: var(--fp-radius-lg);
          box-shadow: var(--fp-shadow);
          overflow: hidden;
          animation: fp-scale-in 0.22s cubic-bezier(0.22,1,0.36,1);
        }
        .dp-panel-header {
          padding: 13px 14px;
          background: var(--fp-accent);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .dp-panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--fp-font-display);
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }
        .dp-panel-title svg { color: rgba(255,255,255,0.9); }
        .dp-panel-x {
          width: 28px;
          height: 28px;
          background: rgba(255,255,255,0.18);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
        }
        .dp-panel-x svg { color: #fff; width: 13px; height: 13px; }

        /* Panel scroll area */
        .dp-panel-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scrollbar-width: thin;
          scrollbar-color: var(--fp-border) transparent;
        }
        .dp-panel-scroll::-webkit-scrollbar { width: 3px; }
        .dp-panel-scroll::-webkit-scrollbar-thumb { background: var(--fp-border); border-radius: 2px; }

        /* Panel empty state */
        .dp-panel-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          gap: 8px;
        }
        .dp-panel-empty-icon {
          width: 60px;
          height: 60px;
          background: var(--fp-bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .dp-panel-empty-icon svg { color: var(--fp-hint); }
        .dp-panel-empty p { color: var(--fp-muted); font-size: 14px; font-weight: 600; font-family: var(--fp-font-body); }
        .dp-panel-empty small { color: var(--fp-hint); font-size: 12px; font-family: var(--fp-font-body); }

        /* Orders inside panel */
        .dp-order-card {
          background: var(--fp-bg);
          border: 1px solid var(--fp-border);
          border-radius: 14px;
          padding: 13px;
        }
        .dp-order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2px;
        }
        .dp-order-id {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 700;
          color: var(--fp-text);
          font-family: var(--fp-font-body);
        }
        .dp-order-meta { font-size: 11px; color: var(--fp-muted); margin-top: 3px; font-family: var(--fp-font-body); }
        .dp-order-divider { height: 1px; background: var(--fp-border); margin: 8px 0; }
        .dp-order-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          padding: 4px 0;
          font-family: var(--fp-font-body);
          color: var(--fp-text);
        }
        .dp-order-item-row strong { color: var(--fp-accent); font-family: var(--fp-font-display); font-size: 13px; }
        .dp-order-total {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 700;
          font-family: var(--fp-font-body);
        }
        .dp-order-total strong { color: var(--fp-accent); font-family: var(--fp-font-display); font-size: 15px; }
        .dp-status-pill { padding: 3px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: capitalize; font-family: var(--fp-font-body); }
        .dp-status-pending { background: #fff8e6; color: #b8740a; }
        .dp-status-preparing { background: #e6f0ff; color: #2052a3; }
        .dp-status-completed { background: var(--fp-success-bg); color: var(--fp-success); }
        .dp-grand-total {
          background: var(--fp-accent);
          border-radius: 12px;
          padding: 13px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .dp-grand-total span { color: rgba(255,255,255,0.85); font-size: 13px; font-family: var(--fp-font-body); }
        .dp-grand-total strong { font-family: var(--fp-font-display); color: #fff; font-size: 22px; font-weight: 700; }

        /* Favorites inside panel */
        .dp-fav-item {
          display: flex;
          gap: 10px;
          background: var(--fp-bg);
          border: 1px solid var(--fp-border);
          border-radius: 12px;
          padding: 10px;
        }
        .dp-fav-item img { width: 62px; height: 62px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
        .dp-fav-info { flex: 1; min-width: 0; }
        .dp-fav-name { font-size: 13px; font-weight: 600; color: var(--fp-text); font-family: var(--fp-font-body); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dp-fav-cat { font-size: 11px; color: var(--fp-muted); margin-top: 1px; font-family: var(--fp-font-body); }
        .dp-fav-price { font-family: var(--fp-font-display); font-size: 14px; font-weight: 600; color: var(--fp-accent); margin-top: 3px; }
        .dp-fav-actions { display: flex; align-items: center; justify-content: space-between; margin-top: 7px; }
        .dp-remove-btn {
          width: 28px;
          height: 28px;
          border: 1px solid #fecdca;
          border-radius: 8px;
          background: #fff5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #e74c3c;
          transition: all 0.15s;
        }
        .dp-remove-btn:hover { background: #fee2e2; }

        /* Cart inside panel */
        .dp-cart-item {
          display: flex;
          gap: 10px;
          background: var(--fp-bg);
          border: 1px solid var(--fp-border);
          border-radius: 12px;
          padding: 10px;
        }
        .dp-cart-item img { width: 58px; height: 58px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
        .dp-cart-item-info { flex: 1; min-width: 0; }
        .dp-cart-item-name { font-size: 13px; font-weight: 600; color: var(--fp-text); font-family: var(--fp-font-body); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dp-cart-item-sub { font-size: 11px; color: var(--fp-muted); margin-top: 1px; font-family: var(--fp-font-body); }
        .dp-cart-item-price { font-family: var(--fp-font-display); font-size: 14px; font-weight: 600; color: var(--fp-accent); margin-top: 3px; }
        .dp-cart-item-actions { display: flex; align-items: center; justify-content: space-between; margin-top: 7px; }
        .dp-cart-footer {
          padding: 12px;
          border-top: 1px solid var(--fp-border);
          flex-shrink: 0;
          background: var(--fp-surface);
        }
        .dp-cart-total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          font-family: var(--fp-font-body);
        }
        .dp-cart-total-row span { font-size: 12px; color: var(--fp-muted); }
        .dp-cart-total-row strong { font-family: var(--fp-font-display); font-size: 20px; font-weight: 700; color: var(--fp-accent); }
        .dp-checkout-btn {
          width: 100%;
          background: var(--fp-accent);
          color: #fff;
          border: none;
          border-radius: 11px;
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--fp-font-body);
          transition: opacity 0.18s;
        }
        .dp-checkout-btn:hover { opacity: 0.88; }

        /* Call form inside panel */
        .dp-panel-form {
          flex: 1;
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .dp-form-icon {
          width: 52px;
          height: 52px;
          background: var(--fp-accent-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--fp-accent);
          margin-bottom: 8px;
        }
        .dp-form-subtitle { font-size: 12px; color: var(--fp-muted); margin-bottom: 18px; text-align: center; font-family: var(--fp-font-body); }
        .dp-form-fields { width: 100%; display: flex; flex-direction: column; gap: 10px; }
        .dp-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--fp-border);
          border-radius: 10px;
          font-size: 13px;
          font-family: var(--fp-font-body);
          color: var(--fp-text);
          outline: none;
          transition: border-color 0.2s;
        }
        .dp-input:focus { border-color: var(--fp-accent-mid); }
        .dp-input::placeholder { color: var(--fp-hint); }
        .dp-table-display {
          padding: 10px 12px;
          background: var(--fp-bg);
          border-radius: 10px;
          border: 1px solid var(--fp-border);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          font-family: var(--fp-font-body);
        }
        .dp-form-actions { display: flex; gap: 8px; width: 100%; margin-top: 16px; }
        .dp-btn-outline {
          flex: 1; padding: 10px; border: 1px solid var(--fp-border);
          border-radius: 10px; font-size: 13px; font-weight: 600;
          color: var(--fp-muted); background: none; cursor: pointer;
          font-family: var(--fp-font-body);
        }
        .dp-btn-primary {
          flex: 1; padding: 10px; background: var(--fp-accent); border: none;
          border-radius: 10px; font-size: 13px; font-weight: 700;
          color: #fff; cursor: pointer; font-family: var(--fp-font-body);
        }
        .dp-btn-primary:hover { opacity: 0.88; }

        /* Info inside panel */
        .dp-info-hero {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--fp-accent-light);
          border: 1px solid var(--fp-accent-mid);
          border-radius: 14px;
          padding: 14px;
        }
        .dp-info-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--fp-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }
        .dp-info-hero h3 { font-size: 15px; font-weight: 700; color: var(--fp-text); font-family: var(--fp-font-body); }
        .dp-info-hero p { font-size: 11px; color: var(--fp-muted); margin-top: 2px; font-family: var(--fp-font-body); }
        .dp-info-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 12px;
          background: var(--fp-bg);
          border-radius: 10px;
          border: 1px solid var(--fp-border);
        }
        .dp-info-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: var(--fp-accent-light);
          color: var(--fp-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dp-info-label { font-size: 10px; font-weight: 700; color: var(--fp-muted); text-transform: uppercase; letter-spacing: 0.05em; font-family: var(--fp-font-body); }
        .dp-info-value { font-size: 12px; font-weight: 600; color: var(--fp-text); margin-top: 2px; font-family: var(--fp-font-body); }
        .dp-info-about {
          padding: 13px;
          background: var(--fp-bg);
          border-radius: 10px;
          border: 1px solid var(--fp-border);
        }
        .dp-info-about h4 { font-size: 13px; font-weight: 700; margin-bottom: 5px; font-family: var(--fp-font-body); }
        .dp-info-about p { font-size: 12px; line-height: 1.65; color: var(--fp-muted); font-family: var(--fp-font-body); }




.dp-ad-card{
  margin-top:16px;

  background:#fff;

  border-radius:16px;

  overflow:hidden;

  border:1px solid #eee;

  box-shadow:
    0 4px 12px rgba(0,0,0,.05);
}

.dp-ad-card img{
  width:100%;
  height:170px;

  object-fit:cover;
}

.dp-ad-content{
  padding:14px;
}

.dp-ad-content h4{
  font-size:15px;
  font-weight:700;
  margin-bottom:6px;
}

.dp-ad-content p{
  font-size:13px;
  color:#666;
}







        /* ─────────── ANIMATIONS ─────────── */
        @keyframes fp-welcome-exit { 0%{opacity:1} 100%{opacity:0;pointer-events:none} }
        @keyframes fp-logo-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,.4)} 50%{box-shadow:0 0 0 12px rgba(255,255,255,0)} }
        @keyframes fp-dot-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes fp-slide-down { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes fp-slide-up { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes fp-slide-in-right { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes fp-fade-in { from{opacity:0} to{opacity:1} }
        @keyframes fp-scale-in { from{transform:scale(0.97);opacity:0} to{transform:scale(1);opacity:1} }
      `}</style>

      {/* Welcome Screen */}
      {showWelcome && (
        <div className="fp-welcome">
          <div className="fp-welcome-logo">
            <UtensilsCrossed />
          </div>
          <h1>Aura Kitchen</h1>
          <p>Premium Dining Experience</p>
          <div className="fp-welcome-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      {/* Toast */}
      {showOrderSuccess && (
        <div className="fp-toast">
          <CheckCircle className="fp-toast-icon" size={20} />
          <div>
            <h4>Order placed successfully!</h4>
            <p>Your order has been sent to the kitchen</p>
          </div>
        </div>
      )}
      {showWaiterSuccess && (
        <div className="fp-toast">
          <CheckCircle className="fp-toast-icon" size={20} />
          <div>
            <h4>Waiter has been notified!</h4>
            <p>Please wait a moment.</p>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          DESKTOP LAYOUT
          ════════════════════════════════════════ */}

      {/* Desktop Navbar */}
      <nav className="dp-navbar">
        <div className="dp-navbar-inner">
          {/* Logo */}
          <div className="dp-logo">
            <div className="dp-logo-icon">
              <UtensilsCrossed />
            </div>
            <div>
              <div className="dp-logo-name">Aura Kitchen</div>
              <div className="dp-logo-sub">Premium Dining</div>
            </div>
          </div>

          {/* Search */}
          <div className="dp-nav-search" style={{ margin: "0 auto" }}>
            <Search />
            <input
              type="text"
              placeholder="Search dishes, categories…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setVisibleItems(8)
              }}
            />
          </div>

          {/* Nav links */}
          <div className="dp-nav-links">
            <button
              className={`dp-nav-btn ${desktopPanel === null ? "dp-active" : ""}`}
              onClick={() => setDesktopPanel(null)}
            >
              <Home size={18} />
              <span className="dp-nav-btn-label">Home</span>
            </button>

            <button
              className={`dp-nav-btn ${desktopPanel === "orders" ? "dp-active" : ""}`}
              onClick={() =>
                setDesktopPanel(desktopPanel === "orders" ? null : "orders")
              }
            >
              <ClipboardList size={18} />
              <span className="dp-nav-btn-label">Orders</span>
              {activeOrders.length > 0 && (
                <span className="dp-nav-badge">{activeOrders.length}</span>
              )}
            </button>

            <button
              className={`dp-nav-btn ${desktopPanel === "favorites" ? "dp-active" : ""}`}
              onClick={() =>
                setDesktopPanel(desktopPanel === "favorites" ? null : "favorites")
              }
            >
              <Heart size={18} />
              <span className="dp-nav-btn-label">Saved</span>
              {favorites.length > 0 && (
                <span className="dp-nav-badge">{favorites.length}</span>
              )}
            </button>

            <button
              className={`dp-nav-btn ${desktopPanel === "call" ? "dp-active" : ""}`}
              onClick={() =>
                setDesktopPanel(desktopPanel === "call" ? null : "call")
              }
            >
              <Phone size={18} />
              <span className="dp-nav-btn-label">Call</span>
            </button>

            <button
              className={`dp-nav-btn ${desktopPanel === "cart" ? "dp-active" : ""}`}
              onClick={() =>
                setDesktopPanel(desktopPanel === "cart" ? null : "cart")
              }
            >
              <ShoppingBag size={18} />
              <span className="dp-nav-btn-label">Cart</span>
              {cart.length > 0 && (
                <span className="dp-nav-badge">{getCartItemCount()}</span>
              )}
            </button>

            <button
              className={`dp-nav-btn ${desktopPanel === "info" ? "dp-active" : ""}`}
              onClick={() =>
                setDesktopPanel(desktopPanel === "info" ? null : "info")
              }
            >
              <Building2 size={18} />
              <span className="dp-nav-btn-label">Info</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop Three-Column Body */}
      <div className={`dp-layout ${desktopPanel ? "dp-has-panel" : ""}`}>

        {/* ── LEFT: Filters Sidebar ── */}
        <aside className="dp-sidebar">
          <div className="dp-filter-card">
            <div className="dp-filter-header">
              <div className="dp-filter-header-left">
                <Filter size={13} />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span
                    style={{
                      background: "#c84b2f",
                      color: "#fff",
                      borderRadius: "20px",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "1px 6px",
                      marginLeft: "2px",
                    }}
                  >
                    {getActiveFiltersCount()}
                  </span>
                )}
              </div>
              {getActiveFiltersCount() > 0 && (
                <button
                  className="dp-filter-clear"
                  onClick={() => {
                    setSelectedFilters({
                      sortBy: "recommended",
                      foodType: [],
                      categories: [],
                      priceRange: [],
                      ratings: [],
                      prepTime: [],
                      spiceLevel: [],
                      bestSellers: false,
                      offers: false,
                      availability: "all",
                    })
                    setSelectedCategory("All")
                    setSearch("")
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="dp-filter-panes">
              {/* Tab list */}
              <div className="dp-filter-tabs">
                {[
                  { id: "sort", label: "Sort By" },
                  { id: "foodType", label: "Food Type" },
                  { id: "categories", label: "Category" },
                  { id: "price", label: "Price" },
                  { id: "ratings", label: "Ratings" },
                  { id: "prepTime", label: "Prep Time" },
                  { id: "spiceLevel", label: "Spice" },
                  { id: "bestSellers", label: "Best Sellers" },
                  { id: "offers", label: "Offers" },
                ].map((t) => (
                  <button
                    key={t.id}
                    className={`dp-filter-tab ${activeFilterSection === t.id ? "dp-tab-active" : ""}`}
                    onClick={() => setActiveFilterSection(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Options pane */}
              <div className="dp-filter-options">
                {activeFilterSection === "sort" &&
                  [
                    { id: "recommended", label: "Recommended" },
                    { id: "priceLow", label: "Price: Low → High" },
                    { id: "priceHigh", label: "Price: High → Low" },
                    { id: "rating", label: "Top Rated" },
                    { id: "popular", label: "Most Popular" },
                    { id: "fastServing", label: "Fast Serving" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`dp-filter-opt ${selectedFilters.sortBy === o.id ? "dp-opt-checked" : ""}`}
                    >
                      <span>{o.label}</span>
                      <input
                        type="radio"
                        checked={selectedFilters.sortBy === o.id}
                        onChange={() =>
                          setSelectedFilters({
                            ...selectedFilters,
                            sortBy: o.id,
                          })
                        }
                      />
                    </label>
                  ))}

                {activeFilterSection === "foodType" &&
                  [
                    { id: "veg", label: "Vegetarian" },
                    { id: "nonveg", label: "Non-Vegetarian" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`dp-filter-opt ${selectedFilters.foodType.includes(o.id) ? "dp-opt-checked" : ""}`}
                    >
                      <span>{o.label}</span>
                      <input
                        type="checkbox"
                        checked={selectedFilters.foodType.includes(o.id)}
                        onChange={() => {
                          const n = selectedFilters.foodType.includes(o.id)
                            ? selectedFilters.foodType.filter((t) => t !== o.id)
                            : [...selectedFilters.foodType, o.id]
                          setSelectedFilters({
                            ...selectedFilters,
                            foodType: n,
                          })
                        }}
                      />
                    </label>
                  ))}

                {activeFilterSection === "categories" && (
                  <>
                    <label
                      className={`dp-filter-opt ${selectedCategory === "All" ? "dp-opt-checked" : ""}`}
                      onClick={() => setSelectedCategory("All")}
                    >
                      <span>All Items</span>
                      <input
                        type="radio"
                        readOnly
                        checked={selectedCategory === "All"}
                      />
                    </label>
                    {categories.map((cat) => (
                      <label
                        key={cat._id}
                        className={`dp-filter-opt ${selectedCategory === cat.name ? "dp-opt-checked" : ""}`}
                        onClick={() => setSelectedCategory(cat.name)}
                      >
                        <span>{cat.name}</span>
                        <input
                          type="radio"
                          readOnly
                          checked={selectedCategory === cat.name}
                        />
                      </label>
                    ))}
                  </>
                )}

                {activeFilterSection === "price" &&
                  [
                    { id: "under100", label: "Under ₹100" },
                    { id: "100to250", label: "₹100 – ₹250" },
                    { id: "250to500", label: "₹250 – ₹500" },
                    { id: "above500", label: "Above ₹500" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`dp-filter-opt ${selectedFilters.priceRange.includes(o.id) ? "dp-opt-checked" : ""}`}
                    >
                      <span>{o.label}</span>
                      <input
                        type="checkbox"
                        checked={selectedFilters.priceRange.includes(o.id)}
                        onChange={() => {
                          const n = selectedFilters.priceRange.includes(o.id)
                            ? selectedFilters.priceRange.filter((p) => p !== o.id)
                            : [...selectedFilters.priceRange, o.id]
                          setSelectedFilters({
                            ...selectedFilters,
                            priceRange: n,
                          })
                        }}
                      />
                    </label>
                  ))}

                {activeFilterSection === "ratings" &&
                  [
                    { id: "above4", label: "4★ & Above" },
                    { id: "above3", label: "3★ & Above" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`dp-filter-opt ${selectedFilters.ratings.includes(o.id) ? "dp-opt-checked" : ""}`}
                    >
                      <span>{o.label}</span>
                      <input
                        type="checkbox"
                        checked={selectedFilters.ratings.includes(o.id)}
                        onChange={() => {
                          const n = selectedFilters.ratings.includes(o.id)
                            ? selectedFilters.ratings.filter((r) => r !== o.id)
                            : [...selectedFilters.ratings, o.id]
                          setSelectedFilters({
                            ...selectedFilters,
                            ratings: n,
                          })
                        }}
                      />
                    </label>
                  ))}

                {activeFilterSection === "prepTime" &&
                  [
                    { id: "under20", label: "Under 20 Min" },
                    { id: "20to30", label: "20 – 30 Min" },
                    { id: "above30", label: "Above 30 Min" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`dp-filter-opt ${selectedFilters.prepTime.includes(o.id) ? "dp-opt-checked" : ""}`}
                    >
                      <span>{o.label}</span>
                      <input
                        type="checkbox"
                        checked={selectedFilters.prepTime.includes(o.id)}
                        onChange={() => {
                          const n = selectedFilters.prepTime.includes(o.id)
                            ? selectedFilters.prepTime.filter((t) => t !== o.id)
                            : [...selectedFilters.prepTime, o.id]
                          setSelectedFilters({
                            ...selectedFilters,
                            prepTime: n,
                          })
                        }}
                      />
                    </label>
                  ))}

                {activeFilterSection === "spiceLevel" &&
                  [
                    { id: "mild", label: "Mild" },
                    { id: "medium", label: "Medium" },
                    { id: "spicy", label: "Spicy" },
                    { id: "extraSpicy", label: "Extra Spicy" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`dp-filter-opt ${selectedFilters.spiceLevel.includes(o.id) ? "dp-opt-checked" : ""}`}
                    >
                      <span>{o.label}</span>
                      <input
                        type="checkbox"
                        checked={selectedFilters.spiceLevel.includes(o.id)}
                        onChange={() => {
                          const n = selectedFilters.spiceLevel.includes(o.id)
                            ? selectedFilters.spiceLevel.filter((s) => s !== o.id)
                            : [...selectedFilters.spiceLevel, o.id]
                          setSelectedFilters({
                            ...selectedFilters,
                            spiceLevel: n,
                          })
                        }}
                      />
                    </label>
                  ))}

                {activeFilterSection === "bestSellers" && (
                  <label
                    className={`dp-filter-opt ${selectedFilters.bestSellers ? "dp-opt-checked" : ""}`}
                  >
                    <span>Best Sellers Only</span>
                    <input
                      type="checkbox"
                      checked={selectedFilters.bestSellers}
                      onChange={() =>
                        setSelectedFilters({
                          ...selectedFilters,
                          bestSellers: !selectedFilters.bestSellers,
                        })
                      }
                    />
                  </label>
                )}

                {activeFilterSection === "offers" && (
                  <label
                    className={`dp-filter-opt ${selectedFilters.offers ? "dp-opt-checked" : ""}`}
                  >
                    <span>Show Offers</span>
                    <input
                      type="checkbox"
                      checked={selectedFilters.offers}
                      onChange={() =>
                        setSelectedFilters({
                          ...selectedFilters,
                          offers: !selectedFilters.offers,
                        })
                      }
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* ── CENTER: Main Menu Content ── */}
        <main className="dp-content">
          {/* Banner */}
          <div className="fp-banner-wrap">
            {banners.map((banner, idx) => (
              <div
                key={banner.id}
                className="fp-banner-slide"
                style={{ opacity: idx === currentBannerIndex ? 1 : 0 }}
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}${banner.image}`}
                  alt={banner.title}
                  loading="lazy"
                />
                <div className="fp-banner-overlay" />
                <div className="fp-banner-text">
                  <h2>{banner.title}</h2>
                  <p>{banner.subtitle}</p>
                </div>
              </div>
            ))}
            <div className="fp-banner-dots">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className={`fp-banner-dot ${idx === currentBannerIndex ? "active" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="fp-categories-section">
            <div
              className="fp-categories-scroll"
              ref={categoriesScrollRef}
            >
              <button
                onClick={() => {
                  setSelectedCategory("All")
                  setVisibleItems(8)
                }}
                className={`fp-cat-pill ${selectedCategory === "All" ? "active" : ""}`}
              >
                <UtensilsCrossed size={13} /> All
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => {
                    setSelectedCategory(category.name)
                    setVisibleItems(8)
                  }}
                  className={`fp-cat-pill ${selectedCategory === category.name ? "active" : ""}`}
                >
                  {categoryIcons[category.name] || <UtensilsCrossed size={13} />}
                  {category.name.length > 10
                    ? category.name.slice(0, 9) + "…"
                    : category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chef's Special */}
          {todaySpecials.length > 0 && currentSpecial && (
            <div className="fp-special-section">
              <div className="fp-special-section-head">
                <ChefHat size={15} style={{ color: "#c9964a" }} />
                <span
                  className="fp-section-title"
                  style={{ marginBottom: 0 }}
                >
                  Chef's Special
                </span>
              </div>
              <div className="fp-special-card">
                <img
                  src={`${import.meta.env.VITE_API_URL}${currentSpecial?.image}`}
                  alt={currentSpecial?.name}
                  loading="lazy"
                />
                <div className="fp-special-overlay" />
                <div className="fp-special-content">
                  <div className="fp-special-badges">
                    <span className="fp-badge fp-badge-gold">
                      <Star size={9} style={{ fill: "#fff" }} />{" "}
                      {currentSpecial?.rating || 4.5}
                    </span>
                    <span className="fp-badge fp-badge-ghost">
                      {currentSpecial?.isVeg ? "Vegetarian" : "Non-Veg"}
                    </span>
                  </div>
                  <div className="fp-special-name">
                    {currentSpecial?.name}
                  </div>
                  <div className="fp-special-footer">
                    <span className="fp-special-price">
                      ₹{currentSpecial?.price}
                    </span>
                    <button
                      onClick={() => addToCart(currentSpecial)}
                      className="fp-special-add-btn"
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              </div>
              <div className="fp-special-dots">
                {todaySpecials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSpecialIndex(idx)}
                    className={`fp-special-dot ${idx === currentSpecialIndex ? "active" : ""}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Menu Grid */}
          <div className="fp-menu-section">
            <div className="fp-menu-head">
              <div className="fp-section-title" style={{ marginBottom: 0 }}>
                Our Menu
              </div>
              <span className="fp-menu-count">
                {getSortedFoods().length} items
              </span>
            </div>
            {getSortedFoods().length === 0 ? (
              <div className="fp-empty">
                <div className="fp-empty-emoji">😢</div>
                <p>No items match your filters</p>
                <button
                  className="fp-empty-clear"
                  onClick={() => {
                    setSelectedFilters({
                      sortBy: "recommended",
                      foodType: [],
                      categories: [],
                      priceRange: [],
                      ratings: [],
                      prepTime: [],
                      spiceLevel: [],
                      bestSellers: false,
                      offers: false,
                      availability: "all",
                    })
                    setSearch("")
                    setSelectedCategory("All")
                    setVegFilter("all")
                  }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="fp-grid">
                {getSortedFoods()
                  .slice(0, visibleItems)
                  .map((food) => (
                    <FoodCard key={food._id} food={food} />
                  ))}
              </div>
            )}
          </div>
        </main>

        {/* ── RIGHT: Panel (shown when desktopPanel !== null) ── */}
        {desktopPanel && (
          <aside className="dp-right-panel">
            <div className="dp-panel-header">
              <div className="dp-panel-title">
                {panelMeta[desktopPanel]?.icon}
                {panelMeta[desktopPanel]?.title}
              </div>
              <button
                className="dp-panel-x"
                onClick={() => setDesktopPanel(null)}
              >
                <X size={13} />
              </button>
            </div>
            <>
  {renderDesktopPanelContent()}

  {activeAd && (
    <div className="dp-ad-card">

      <img
        src={`${import.meta.env.VITE_API_URL}${activeAd.image}`}
        alt={activeAd.title}
      />

      <div className="dp-ad-content">

        <h4>
          {activeAd.title}
        </h4>

        <p>
          {activeAd.description}
        </p>

      </div>

    </div>
  )}
</>
          </aside>
        )}
      </div>

      {/* ════════════════════════════════════════
          MOBILE / TABLET LAYOUT (unchanged)
          ════════════════════════════════════════ */}
      {!isDesktop && (
        <div className="fp-root">
          {/* Header */}
          <div className="fp-header">
            <div className="fp-header-inner">
              <div className="fp-brand">
                <div className="fp-brand-icon">
                  <UtensilsCrossed />
                  <div className="fp-brand-dot" />
                </div>
                <div>
                  <div className="fp-brand-name">Aura Kitchen</div>
                  <div className="fp-brand-meta">
                    <span>
                      <MapPin size={9} /> Main Street
                    </span>
                    <span style={{ color: "var(--fp-hint)" }}>·</span>
                    <span style={{ color: "#2d9e5a" }}>
                      <Star
                        size={9}
                        style={{ fill: "#2d9e5a", color: "#2d9e5a" }}
                      />{" "}
                      4.8
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="fp-cart-btn"
                onClick={() => setShowInfoModal(true)}
              >
                <Building2 />
              </button>
            </div>
          </div>

          <div className="fp-body">
            {/* Banner */}
            <div className="fp-banner-wrap">
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className="fp-banner-slide"
                  style={{ opacity: idx === currentBannerIndex ? 1 : 0 }}
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}${banner.image}`}
                    alt={banner.title}
                    loading="lazy"
                  />
                  <div className="fp-banner-overlay" />
                  <div className="fp-banner-text">
                    <h2>{banner.title}</h2>
                    <p>{banner.subtitle}</p>
                  </div>
                </div>
              ))}
              <div className="fp-banner-dots">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBannerIndex(idx)}
                    className={`fp-banner-dot ${idx === currentBannerIndex ? "active" : ""}`}
                  />
                ))}
              </div>
            </div>

            {/* Search + Filter */}
            <div className="fp-search-row">
              <div className="fp-search-wrap">
                <Search />
                <input
                  type="text"
                  placeholder="Search dishes…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setVisibleItems(8)
                  }}
                  className="fp-search-input"
                />
              </div>
              <button
                className="fp-filter-btn"
                onClick={() => setShowFilterModal(true)}
              >
                <SlidersHorizontal />
                {getActiveFiltersCount() > 0 && (
                  <span className="fp-filter-badge">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Categories */}
            <div className="fp-categories-section">
              <div
                className="fp-categories-scroll"
                ref={categoriesScrollRef}
              >
                <button
                  onClick={() => {
                    setSelectedCategory("All")
                    setVisibleItems(8)
                  }}
                  className={`fp-cat-pill ${selectedCategory === "All" ? "active" : ""}`}
                >
                  <UtensilsCrossed size={13} /> All
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => {
                      setSelectedCategory(category.name)
                      setVisibleItems(8)
                    }}
                    className={`fp-cat-pill ${selectedCategory === category.name ? "active" : ""}`}
                  >
                    {categoryIcons[category.name] || <UtensilsCrossed size={13} />}
                    {category.name.length > 10
                      ? category.name.slice(0, 9) + "…"
                      : category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Chef's Special */}
            {todaySpecials.length > 0 && currentSpecial && (
              <div className="fp-special-section">
                <div className="fp-special-section-head">
                  <ChefHat size={15} style={{ color: "#c9964a" }} />
                  <span
                    className="fp-section-title"
                    style={{ marginBottom: 0 }}
                  >
                    Chef's Special
                  </span>
                </div>
                <div className="fp-special-card">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${currentSpecial?.image}`}
                    alt={currentSpecial?.name}
                    loading="lazy"
                  />
                  <div className="fp-special-overlay" />
                  <div className="fp-special-content">
                    <div className="fp-special-badges">
                      <span className="fp-badge fp-badge-gold">
                        <Star size={9} style={{ fill: "#fff" }} />{" "}
                        {currentSpecial?.rating || 4.5}
                      </span>
                      <span className="fp-badge fp-badge-ghost">
                        {currentSpecial?.isVeg ? "Vegetarian" : "Non-Veg"}
                      </span>
                    </div>
                    <div className="fp-special-name">
                      {currentSpecial?.name}
                    </div>
                    <div className="fp-special-footer">
                      <span className="fp-special-price">
                        ₹{currentSpecial?.price}
                      </span>
                      <button
                        onClick={() => addToCart(currentSpecial)}
                        className="fp-special-add-btn"
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
                <div className="fp-special-dots">
                  {todaySpecials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSpecialIndex(idx)}
                      className={`fp-special-dot ${idx === currentSpecialIndex ? "active" : ""}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Menu Grid */}
            <div className="fp-menu-section">
              <div className="fp-menu-head">
                <div
                  className="fp-section-title"
                  style={{ marginBottom: 0 }}
                >
                  Our Menu
                </div>
                <span className="fp-menu-count">
                  {getSortedFoods().length} items
                </span>
              </div>
              {getSortedFoods().length === 0 ? (
                <div className="fp-empty">
                  <div className="fp-empty-emoji">😢</div>
                  <p>No items match your filters</p>
                  <button
                    className="fp-empty-clear"
                    onClick={() => {
                      setSelectedFilters({
                        sortBy: "recommended",
                        foodType: [],
                        categories: [],
                        priceRange: [],
                        ratings: [],
                        prepTime: [],
                        spiceLevel: [],
                        bestSellers: false,
                        offers: false,
                        availability: "all",
                      })
                      setSearch("")
                      setSelectedCategory("All")
                      setVegFilter("all")
                    }}
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="fp-grid">
                  {filteredFoods.slice(0, visibleItems).map((food) => {
                    const cartItem = cart.find((item) => item._id === food._id)
                    const isFav = favorites.find(
                      (item) => item._id === food._id
                    )
                    return (
                      <div key={food._id} className="fp-food-card">
                        <div className="fp-food-img-wrap">
                          <img
                            src={`${import.meta.env.VITE_API_URL}${food.image}`}
                            alt={food.name}
                            loading="lazy"
                          />
                          <button
                            className="fp-favorite-btn"
                            onClick={() => toggleFavorite(food)}
                          >
                            <Heart
                              size={14}
                              fill={isFav ? "#ef4444" : "transparent"}
                              color={isFav ? "#ef4444" : "white"}
                            />
                          </button>
                          {food.isPopular && (
                            <div className="fp-bestseller-tag">
                              <Award size={9} /> Best
                            </div>
                          )}
                        </div>
                        <div className="fp-food-info">
                          <div className="fp-food-name">{food.name}</div>
                          <div className="fp-food-meta">
                            <span className="fp-food-meta-item">
                              <Star
                                size={10}
                                style={{ fill: "#f59e0b", color: "#f59e0b" }}
                              />
                              {food.rating || 4.5}
                            </span>
                            <span className="fp-food-meta-sep">·</span>
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
                                onClick={() => addToCart(food)}
                              >
                                <Plus size={11} /> Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Floating cart */}
          {cart.length > 0 && (
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
                    View Cart <ChevronRight size={12} />
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Orders Modal (mobile) */}
          {showOrdersModal && (
            <div
              className="fp-overlay"
              onClick={() => setShowOrdersModal(false)}
            >
              <div
                className="fp-sheet"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="fp-sheet-handle" />
                <div className="fp-sheet-header">
                  <div className="fp-sheet-title">
                    <ClipboardList /> Your Orders
                  </div>
                  <button
                    className="fp-sheet-close"
                    onClick={() => setShowOrdersModal(false)}
                  >
                    <X />
                  </button>
                </div>
                <div className="fp-sheet-scroll">
                  <div className="fp-orders-summary">
                    <Receipt size={20} />
                    <div>
                      <h3>Order Summary</h3>
                      <p>Track all your placed orders</p>
                    </div>
                  </div>
                  {activeOrders.map((order) => (
                    <div
                      key={order._id || order.orderId}
                      className="fp-order-card"
                    >
                      <div className="fp-order-header">
                        <div>
                          <div className="fp-order-id">
                            <ClipboardList size={14} />
                            Order #{order.orderId}
                          </div>
                          <div className="fp-order-time">
                            {order.items?.length || 0} Items
                          </div>
                        </div>
                        <span
                          className={`fp-status-pill ${
                            order.status === "completed"
                              ? "fp-status-completed"
                              : order.status === "preparing"
                              ? "fp-status-preparing"
                              : "fp-status-pending"
                          }`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </div>
                      <div className="fp-order-divider" />
                      {order.items?.map((item) => (
                        <div
                          key={`${item.name}-${item.price}`}
                          className="fp-order-item-row"
                        >
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <strong>₹{item.price * item.quantity}</strong>
                        </div>
                      ))}
                      <div className="fp-order-divider" />
                      <div className="fp-order-total">
                        <span>Total Amount</span>
                        <strong>₹{order.totalAmount || order.total}</strong>
                      </div>
                    </div>
                  ))}
                  <div className="fp-grand-total-card">
                    <div>
                      <div className="fp-grand-total-label">Grand Total</div>
                      <small style={{ color: "rgba(255,255,255,.8)" }}>
                        {activeOrders.length} Orders
                      </small>
                    </div>
                    <div className="fp-grand-total-amount">
                      ₹{combinedBillTotal}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Favorites Modal (mobile) */}
          {showFavoritesModal && (
            <div
              className="fp-overlay"
              onClick={() => setShowFavoritesModal(false)}
            >
              <div
                className="fp-sheet"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="fp-sheet-handle" />
                <div className="fp-sheet-header">
                  <div className="fp-sheet-title">
                    <Heart size={17} /> Your Favorites
                  </div>
                  <button
                    className="fp-sheet-close"
                    onClick={() => setShowFavoritesModal(false)}
                  >
                    <X />
                  </button>
                </div>
                <div className="fp-sheet-scroll">
                  {favorites.length === 0 ? (
                    <div className="fp-cart-empty">
                      <div className="fp-cart-empty-icon">
                        <Heart />
                      </div>
                      <p>No favorites yet</p>
                      <small>Add your favorite foods ❤️</small>
                    </div>
                  ) : (
                    favorites.map((food) => {
                      const cartItem = cart.find(
                        (item) => item._id === food._id
                      )
                      return (
                        <div key={food._id} className="fp-cart-item">
                          <img
                            src={`${import.meta.env.VITE_API_URL}${food.image}`}
                            alt={food.name}
                            loading="lazy"
                          />
                          <div className="fp-cart-item-info">
                            <div className="fp-cart-item-name">
                              {food.name}
                            </div>
                            <div className="fp-cart-item-sub">
                              {food.category?.name}
                            </div>
                            <div className="fp-cart-item-price">
                              ₹{food.price}
                            </div>
                            <div className="fp-cart-item-actions">
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
                                  onClick={() => addToCart(food)}
                                >
                                  <Plus size={11} />
                                  Add
                                </button>
                              )}
                              <button
                                className="fp-cart-remove"
                                onClick={() => toggleFavorite(food)}
                              >
                                <Trash2 size={12} />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Nav */}
          <div className="fp-bottom-nav">
            <div className="fp-nav-inner">
              {[
                { id: "home", icon: <Home />, label: "Home" },
                { id: "orders", icon: <ClipboardList />, label: "Orders" },
                { id: "favorites", icon: <Heart />, label: "Favorites" },
                { id: "call", icon: <Phone />, label: "Call" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`fp-nav-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(tab.id)
                    if (tab.id === "home")
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    if (tab.id === "orders") setShowOrdersModal(true)
                    if (tab.id === "favorites") setShowFavoritesModal(true)
                    if (tab.id === "call") setShowCallModal(true)
                  }}
                >
                  {tab.icon}
                  <span className="fp-nav-label">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="fp-nav-indicator" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Sheet (mobile) */}
          {showFilterModal && (
            <div
              className="fp-overlay"
              onClick={() => setShowFilterModal(false)}
            >
              <div
                className="fp-sheet"
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: "92vh" }}
              >
                <div className="fp-sheet-handle" />
                <div className="fp-sheet-header">
                  <div className="fp-sheet-title">
                    <SlidersHorizontal /> Filter Foods
                  </div>
                  <button
                    className="fp-sheet-close"
                    onClick={() => setShowFilterModal(false)}
                  >
                    <X />
                  </button>
                </div>
                <div
                  className="fp-filter-body"
                  style={{ flex: 1, overflow: "hidden" }}
                >
                  <div className="fp-filter-sidebar">
                    {filterSections.map((s) => (
                      <button
                        key={s.id}
                        className={`fp-filter-sidebar-btn ${activeFilterSection === s.id ? "active" : ""}`}
                        onClick={() => setActiveFilterSection(s.id)}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                  <div className="fp-filter-panel">
                    {activeFilterSection === "sort" && (
                      <div>
                        <div className="fp-filter-group-title">Sort By</div>
                        {[
                          { id: "recommended", label: "Recommended" },
                          { id: "priceLow", label: "Price: Low to High" },
                          { id: "priceHigh", label: "Price: High to Low" },
                          { id: "rating", label: "Top Rated" },
                          { id: "popular", label: "Most Popular" },
                          { id: "fastServing", label: "Fast Serving" },
                        ].map((o) => (
                          <label key={o.id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {o.label}
                            </span>
                            <input
                              type="radio"
                              name="sortBy"
                              className="fp-filter-radio"
                              checked={selectedFilters.sortBy === o.id}
                              onChange={() =>
                                setSelectedFilters({
                                  ...selectedFilters,
                                  sortBy: o.id,
                                })
                              }
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {activeFilterSection === "foodType" && (
                      <div>
                        <div className="fp-filter-group-title">Food Type</div>
                        {[
                          { id: "veg", label: "Vegetarian" },
                          { id: "nonveg", label: "Non-Vegetarian" },
                        ].map((o) => (
                          <label key={o.id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {o.label}
                            </span>
                            <input
                              type="checkbox"
                              className="fp-filter-check"
                              checked={selectedFilters.foodType.includes(o.id)}
                              onChange={() => {
                                const n = selectedFilters.foodType.includes(
                                  o.id
                                )
                                  ? selectedFilters.foodType.filter(
                                      (t) => t !== o.id
                                    )
                                  : [...selectedFilters.foodType, o.id]
                                setSelectedFilters({
                                  ...selectedFilters,
                                  foodType: n,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {activeFilterSection === "categories" && (
                      <div>
                        <div className="fp-filter-group-title">Categories</div>
                        {categories.map((cat) => (
                          <label key={cat._id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {cat.name}
                            </span>
                            <input
                              type="checkbox"
                              className="fp-filter-check"
                              checked={selectedFilters.categories.includes(
                                cat.name
                              )}
                              onChange={() => {
                                const n = selectedFilters.categories.includes(
                                  cat.name
                                )
                                  ? selectedFilters.categories.filter(
                                      (c) => c !== cat.name
                                    )
                                  : [...selectedFilters.categories, cat.name]
                                setSelectedFilters({
                                  ...selectedFilters,
                                  categories: n,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {activeFilterSection === "price" && (
                      <div>
                        <div className="fp-filter-group-title">
                          Price Range
                        </div>
                        {[
                          { id: "under100", label: "Under ₹100" },
                          { id: "100to250", label: "₹100 – ₹250" },
                          { id: "250to500", label: "₹250 – ₹500" },
                          { id: "above500", label: "Above ₹500" },
                        ].map((o) => (
                          <label key={o.id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {o.label}
                            </span>
                            <input
                              type="checkbox"
                              className="fp-filter-check"
                              checked={selectedFilters.priceRange.includes(
                                o.id
                              )}
                              onChange={() => {
                                const n = selectedFilters.priceRange.includes(
                                  o.id
                                )
                                  ? selectedFilters.priceRange.filter(
                                      (p) => p !== o.id
                                    )
                                  : [...selectedFilters.priceRange, o.id]
                                setSelectedFilters({
                                  ...selectedFilters,
                                  priceRange: n,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {activeFilterSection === "ratings" && (
                      <div>
                        <div className="fp-filter-group-title">
                          Minimum Rating
                        </div>
                        {[
                          { id: "above4", label: "⭐ 4.0 & above" },
                          { id: "above3", label: "⭐ 3.0 & above" },
                        ].map((o) => (
                          <label key={o.id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {o.label}
                            </span>
                            <input
                              type="checkbox"
                              className="fp-filter-check"
                              checked={selectedFilters.ratings.includes(o.id)}
                              onChange={() => {
                                const n = selectedFilters.ratings.includes(o.id)
                                  ? selectedFilters.ratings.filter(
                                      (r) => r !== o.id
                                    )
                                  : [...selectedFilters.ratings, o.id]
                                setSelectedFilters({
                                  ...selectedFilters,
                                  ratings: n,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {activeFilterSection === "prepTime" && (
                      <div>
                        <div className="fp-filter-group-title">
                          Preparation Time
                        </div>
                        {[
                          { id: "under20", label: "Under 20 minutes" },
                          { id: "20to30", label: "20 – 30 minutes" },
                          { id: "above30", label: "Above 30 minutes" },
                        ].map((o) => (
                          <label key={o.id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {o.label}
                            </span>
                            <input
                              type="checkbox"
                              className="fp-filter-check"
                              checked={selectedFilters.prepTime.includes(o.id)}
                              onChange={() => {
                                const n = selectedFilters.prepTime.includes(
                                  o.id
                                )
                                  ? selectedFilters.prepTime.filter(
                                      (t) => t !== o.id
                                    )
                                  : [...selectedFilters.prepTime, o.id]
                                setSelectedFilters({
                                  ...selectedFilters,
                                  prepTime: n,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {activeFilterSection === "spiceLevel" && (
                      <div>
                        <div className="fp-filter-group-title">
                          Spice Level
                        </div>
                        {[
                          { id: "mild", label: "Mild 😊" },
                          { id: "medium", label: "Medium 😐" },
                          { id: "spicy", label: "Spicy 🔥" },
                          { id: "extraSpicy", label: "Extra Spicy 🌶️" },
                        ].map((o) => (
                          <label key={o.id} className="fp-filter-option">
                            <span className="fp-filter-option-label">
                              {o.label}
                            </span>
                            <input
                              type="checkbox"
                              className="fp-filter-check"
                              checked={selectedFilters.spiceLevel.includes(
                                o.id
                              )}
                              onChange={() => {
                                const n = selectedFilters.spiceLevel.includes(
                                  o.id
                                )
                                  ? selectedFilters.spiceLevel.filter(
                                      (s) => s !== o.id
                                    )
                                  : [...selectedFilters.spiceLevel, o.id]
                                setSelectedFilters({
                                  ...selectedFilters,
                                  spiceLevel: n,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    )}
                    {activeFilterSection === "bestSellers" && (
                      <div>
                        <div className="fp-filter-group-title">
                          Best Sellers
                        </div>
                        <label className="fp-filter-option">
                          <span className="fp-filter-option-label">
                            Show only best sellers
                          </span>
                          <input
                            type="checkbox"
                            className="fp-filter-check"
                            checked={selectedFilters.bestSellers}
                            onChange={() =>
                              setSelectedFilters({
                                ...selectedFilters,
                                bestSellers: !selectedFilters.bestSellers,
                              })
                            }
                          />
                        </label>
                      </div>
                    )}
                    {activeFilterSection === "offers" && (
                      <div>
                        <div className="fp-filter-group-title">Offers</div>
                        <label className="fp-filter-option">
                          <span className="fp-filter-option-label">
                            Show items with offers
                          </span>
                          <input
                            type="checkbox"
                            className="fp-filter-check"
                            checked={selectedFilters.offers}
                            onChange={() =>
                              setSelectedFilters({
                                ...selectedFilters,
                                offers: !selectedFilters.offers,
                              })
                            }
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div className="fp-sheet-footer">
                  <button
                    className="fp-btn-outline"
                    onClick={() =>
                      setSelectedFilters({
                        sortBy: "recommended",
                        foodType: [],
                        categories: [],
                        priceRange: [],
                        ratings: [],
                        prepTime: [],
                        spiceLevel: [],
                        bestSellers: false,
                        offers: false,
                        availability: "all",
                      })
                    }
                  >
                    Clear All
                  </button>
                  <button
                    className="fp-btn-primary"
                    onClick={() => setShowFilterModal(false)}
                  >
                    Show {getSortedFoods().length} Foods
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table / Order Modal */}
          {showTableModal && (
            <div
              className="fp-modal-wrap"
              onClick={() => setShowTableModal(false)}
            >
              <div
                className="fp-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="fp-modal-icon fp-modal-icon-accent">
                  <ShoppingBag />
                </div>
                <div className="fp-modal-title">Place Your Order</div>
                <div className="fp-modal-subtitle">
                  Confirm your details to proceed
                </div>
                <div className="fp-modal-inputs">
                  <input
                    type="text"
                    className="fp-input"
                    placeholder="Your Name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value)
                      localStorage.setItem("customerName", e.target.value)
                    }}
                  />
                  {tableId ? (
                    <div className="fp-table-display">
                      <Users size={14} />
                      <span>Table Number: #{tableId}</span>
                    </div>
                  ) : (
                    <input
                      type="number"
                      className="fp-input"
                      placeholder="Table Number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                    />
                  )}
                </div>
                <div className="fp-modal-actions">
                  <button
                    className="fp-btn-outline"
                    onClick={() => {
                      setShowTableModal(false)
                      setIsCartOpen(false)
                    }}
                  >
                    Cancel
                  </button>
                  <button className="fp-btn-primary" onClick={placeOrder}>
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Call Waiter Modal */}
          {showCallModal && (
            <div
              className="fp-modal-wrap"
              onClick={() => setShowCallModal(false)}
            >
              <div
                className="fp-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="fp-modal-icon fp-modal-icon-accent">
                  <Phone />
                </div>
                <div className="fp-modal-title">Call Waiter</div>
                <div className="fp-modal-subtitle">
                  Request assistance at your table
                </div>
                <div className="fp-modal-inputs">
                  <input
                    type="text"
                    className="fp-input"
                    placeholder="Your Name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value)
                      localStorage.setItem("customerName", e.target.value)
                    }}
                  />
                  {tableId ? (
                    <div className="fp-table-display">
                      <Users size={14} />
                      <span>Table Number: #{tableId}</span>
                    </div>
                  ) : (
                    <input
                      type="number"
                      className="fp-input"
                      placeholder="Table Number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                    />
                  )}
                </div>
                <div className="fp-modal-actions">
                  <button
                    className="fp-btn-outline"
                    onClick={() => setShowCallModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="fp-btn-primary"
                    onClick={async () => {
                      await handleCallWaiter()
                      setShowCallModal(false)
                    }}
                  >
                    {isCalling ? "Calling…" : "Call Waiter"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cart Drawer */}
          {isCartOpen && (
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
                            src={`${import.meta.env.VITE_API_URL}${item.image}`}
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
          )}

          {/* Info Modal (mobile) */}
          {showInfoModal && (
            <div
              className="fp-overlay"
              onClick={() => setShowInfoModal(false)}
            >
              <div
                className="fp-sheet"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="fp-sheet-handle" />
                <div className="fp-sheet-header">
                  <div className="fp-sheet-title">
                    <Building2 /> Restaurant Info
                  </div>
                  <button
                    className="fp-sheet-close"
                    onClick={() => setShowInfoModal(false)}
                  >
                    <X />
                  </button>
                </div>
                <div className="fp-sheet-scroll">
                  <div className="fp-info-hero">
                    <div className="fp-info-logo">
                      <UtensilsCrossed size={26} />
                    </div>
                    <div>
                      <h3>Aura Kitchen</h3>
                      <p>Premium Dining Experience</p>
                    </div>
                  </div>
                  {[
                    { icon: <Star size={16} />, label: "Rating", value: "4.8 / 5.0" },
                    { icon: <MapPin size={16} />, label: "Address", value: "Main Street, Coimbatore" },
                    { icon: <Clock3 size={16} />, label: "Hours", value: "10:00 AM – 11:00 PM" },
                    { icon: <Phone size={16} />, label: "Phone", value: "+91 9876543210" },
                    { icon: <Mail size={16} />, label: "Email", value: "foodie@gmail.com" },
                    { icon: <Globe size={16} />, label: "Website", value: "www.foodie.com" },
                    { icon: <ShieldCheck size={16} />, label: "Services", value: "Dine-In · Takeaway · Delivery" },
                  ].map((item, i) => (
                    <div key={i} className="fp-info-card">
                      <div className="fp-info-icon">{item.icon}</div>
                      <div>
                        <div className="fp-info-label">{item.label}</div>
                        <div className="fp-info-value">{item.value}</div>
                      </div>
                    </div>
                  ))}
                  <div className="fp-info-about">
                    <h4>About Us</h4>
                    <p>
                      Aura Kitchen is dedicated to delivering high-quality
                      food with exceptional customer service and a memorable
                      dining experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bill Modal (mobile) */}
          {showBillModal && (
            <div
              className="fp-overlay"
              onClick={() => setShowBillModal(false)}
            >
              <div
                className="fp-sheet"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="fp-sheet-handle" />
                <div className="fp-sheet-header">
                  <div className="fp-sheet-title">
                    <Receipt /> Final Bill
                  </div>
                  <button
                    className="fp-sheet-close"
                    onClick={() => setShowBillModal(false)}
                  >
                    <X />
                  </button>
                </div>
                <div className="fp-sheet-scroll">
                  {activeOrders.map((order) => (
                    <div key={order._id} className="fp-order-card">
                      <div className="fp-order-id">
                        <Receipt size={12} /> {order.orderId}
                      </div>
                      {order.items.map((item) => (
                        <div
                          key={`${item.name}-${item.price}`}
                          className="fp-order-item-row"
                        >
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="fp-grand-total-card">
                    <div>
                      <div className="fp-grand-total-label">Grand Total</div>
                      <small style={{ color: "rgba(255,255,255,.8)" }}>
                        {activeOrders.length} Orders
                      </small>
                    </div>
                    <div className="fp-grand-total-amount">
                      ₹{combinedBillTotal}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Track Orders Modal (mobile) */}
          {showTrackOrders && (
            <div
              className="fp-overlay"
              onClick={() => setShowTrackOrders(false)}
            >
              <div
                className="fp-sheet"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="fp-sheet-handle" />
                <div className="fp-sheet-header">
                  <div className="fp-sheet-title">Track Orders</div>
                  <button
                    className="fp-sheet-close"
                    onClick={() => setShowTrackOrders(false)}
                  >
                    <X />
                  </button>
                </div>
                <div className="fp-sheet-scroll">
                  {activeOrders.map((order) => (
                    <div key={order._id} className="fp-order-card">
                      <div className="fp-order-header">
                        <div className="fp-order-id">
                          <Receipt size={12} /> {order.orderId}
                        </div>
                        <span
                          className={`fp-status-pill ${
                            order.status === "completed"
                              ? "fp-status-completed"
                              : order.status === "preparing"
                              ? "fp-status-preparing"
                              : "fp-status-pending"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      {order.items.map((item) => (
                        <div
                          key={`${item.name}-${item.price}`}
                          className="fp-order-item-row"
                        >
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="fp-order-divider" />
                      <div className="fp-order-total">
                        <span>Order Total</span>
                        <strong>₹{order.totalAmount}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Table/Order Modal (desktop — shown outside mobile wrapper) ── */}
      {isDesktop && showTableModal && (
        <div
          className="fp-modal-wrap"
          onClick={() => setShowTableModal(false)}
        >
          <div className="fp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fp-modal-icon fp-modal-icon-accent">
              <ShoppingBag />
            </div>
            <div className="fp-modal-title">Place Your Order</div>
            <div className="fp-modal-subtitle">
              Confirm your details to proceed
            </div>
            <div className="fp-modal-inputs">
              <input
                type="text"
                className="fp-input"
                placeholder="Your Name"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value)
                  localStorage.setItem("customerName", e.target.value)
                }}
              />
              {tableId ? (
                <div className="fp-table-display">
                  <Users size={14} />
                  <span>Table Number: #{tableId}</span>
                </div>
              ) : (
                <input
                  type="number"
                  className="fp-input"
                  placeholder="Table Number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                />
              )}
            </div>
            <div className="fp-modal-actions">
              <button
                className="fp-btn-outline"
                onClick={() => setShowTableModal(false)}
              >
                Cancel
              </button>
              <button className="fp-btn-primary" onClick={placeOrder}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MenuPage