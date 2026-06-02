import { useEffect, useState, useRef } from "react"
import { getFoods } from "../../services/foodService"
import { getCategories } from "../../services/categoryService"
import { createOrder } from "../../services/orderService"
import { getBanners } from "../../services/bannerService"
import { createWaiterCall } from "../../services/waiterCallService"
import { useParams } from "react-router-dom"
import axios from "axios"
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
  ShieldCheck
} from "lucide-react"



function MenuPage() {
  const customerSessionRef = useRef("")
  const { tableId } = useParams()

  console.log("TABLE ID:", tableId)

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
    availability: "all"
  })
  
  const categoriesScrollRef = useRef(null)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)
  
  // Category Icons Mapping
  const categoryIcons = {
    "All": <UtensilsCrossed size={20} />,
    "Biryani": <ChefHat size={20} />,
    "Chicken": <Coffee size={20} />,
    "Mutton": <Coffee size={20} />,
    "Egg": <Coffee size={20} />,
    "Fast Food": <Zap size={20} />,
    "Pizza": <ChefHat size={20} />,
    "Burger": <ChefHat size={20} />,
    "Pasta": <ChefHat size={20} />,
    "Seafood": <Coffee size={20} />,
    "BBQ": <ChefHat size={20} />,
    "Chinese": <ChefHat size={20} />,
    "Drinks": <Coffee size={20} />,
    "Desserts": <Coffee size={20} />,
    "Salads": <Coffee size={20} />,
    "Breakfast": <Coffee size={20} />,
    "Rolls": <ChefHat size={20} />,
    "Curry": <ChefHat size={20} />,
    "Noodles": <ChefHat size={20} />,
    "Rice": <ChefHat size={20} />,
    "Sandwich": <ChefHat size={20} />,
    "Wrap": <ChefHat size={20} />,
    "Fries": <ChefHat size={20} />,
    "Ice Cream": <Coffee size={20} />,
    "Cake": <Coffee size={20} />
  }

  // Welcome screen auto-hide after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!customerSessionId) return
    fetchActiveOrder()
    const interval = setInterval(() => {
      fetchActiveOrder()
    }, 5000)
    return () => clearInterval(interval)
  }, [customerSessionId])

// Auto-rotate banners
useEffect(() => {

  if (banners.length === 0) return

  const bannerInterval = setInterval(() => {
    setCurrentBannerIndex(
      (prev) => (prev + 1) % banners.length
    )
  }, 5000)

  return () => clearInterval(bannerInterval)

}, [banners.length])

  // Auto-rotate chef's special
  useEffect(() => {
    const specialItems = foods.filter(f => f.isPopular)
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
      const currentSessionId =
  customerSessionRef.current

if (!currentSessionId) return
      const response = await axios.get(
`${import.meta.env.VITE_API_URL}/api/orders/session/${currentSessionId}`
)
      console.log("TRACK RESPONSE:", response.data)
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
    

    



    // GENERATE CUSTOMER SESSION
    // LOAD CUSTOMER NAME
const savedName = sessionStorage.getItem(
  `customerName_${tableId}`
)
   if (savedName) {
      setCustomerName(savedName)
    }

  let savedCustomerSession =
  sessionStorage.getItem(
    "customerSessionId"
  )

if (!savedCustomerSession) {

  savedCustomerSession =
    `CUS-${tableId}-${Date.now()}-${Math.floor(Math.random()*1000)}`

  sessionStorage.setItem(
    "customerSessionId",
    savedCustomerSession
  )
}

console.log(
  "CUSTOMER SESSION:",
  savedCustomerSession
)

setCustomerSessionId(
  savedCustomerSession
)

customerSessionRef.current =
  savedCustomerSession

  loadCartFromStorage()

  const favoriteKey =
  `favoriteFoods_${savedCustomerSession}`

const savedFavorites =
  localStorage.getItem(favoriteKey)

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

  const currentSessionId =
    customerSessionRef.current

  if (!currentSessionId) return

  const cartKey =
    `restaurantCart_${currentSessionId}`

  const savedCart =
    localStorage.getItem(cartKey)

  if (savedCart) {

    setCart(JSON.parse(savedCart))

  } else {

    setCart([])

  }
}

const saveCartToStorage = (updatedCart) => {

  const currentSessionId =
    customerSessionRef.current

  if (!currentSessionId) return

  const cartKey =
    `restaurantCart_${currentSessionId}`

  localStorage.setItem(
    cartKey,
    JSON.stringify(updatedCart)
  )

  setCart(updatedCart)
}

  // CART FUNCTIONS
  const addToCart = (food) => {
    const existingItem = cart.find(item => item._id === food._id)
    let updatedCart
    
    if (existingItem) {
      updatedCart = cart.map(item =>
        item._id === food._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      updatedCart = [...cart, { ...food, quantity: 1 }]
    }
    
    saveCartToStorage(updatedCart)
    
    // Cart animation
    setCartAnimation(true)
    setTimeout(() => setCartAnimation(false), 300)
    
    const btn = document.getElementById(`add-btn-${food._id}`)
    if (btn) {
      btn.classList.add('scale-95')
      setTimeout(() => btn.classList.remove('scale-95'), 150)
    }
  }

  const updateQuantity = (foodId, newQuantity) => {
  if (newQuantity <= 0) {
    const updatedCart = cart.filter(
      item => item._id !== foodId
    )
    saveCartToStorage(updatedCart)
  } else {
    const updatedCart = cart.map(item =>
      item._id === foodId
        ? {
            ...item,
            quantity: newQuantity
          }
        : item
    )

    saveCartToStorage(updatedCart)
  }
}

  const removeFromCart = (foodId) => {
    const updatedCart = cart.filter(item => item._id !== foodId)
    saveCartToStorage(updatedCart)
  }

  const toggleFavorite = (food) => {

  const isAlreadyFavorite = favorites.find(
    (item) => item._id === food._id
  )

  let updatedFavorites

  if (isAlreadyFavorite) {

    updatedFavorites = favorites.filter(
      (item) => item._id !== food._id
    )

  } else {

    updatedFavorites = [...favorites, food]

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
      sum + (Number(item.price) * Number(item.quantity)),
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

      console.log("ORDER DETAILS:", orderDetails)

      await createOrder(orderDetails)

sessionStorage.setItem(
  `customerName_${tableId}`,
  customerName
)   
   fetchActiveOrder()

      setShowOrderSuccess(true)

      // CLEAR EVERYTHING
      saveCartToStorage([])
      setCart([])
      setShowTableModal(false)

      if (!tableId) {
        setTableNumber("")
      }

      setIsCartOpen(false)

      setTimeout(() => {
        setShowOrderSuccess(false)
      }, 3000)

    } catch (error) {
      console.log(error)
      alert("Failed to place order")
    }
  }

  // CALL WAITER FUNCTION
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
      await createWaiterCall({
        customerName,
        tableNumber: finalTableNumber,
      })
      alert("Waiter called successfully")
      setShowCallModal(false)
      
      setTableNumber("")
    } catch (error) {
      console.log(error)
    } finally {
      setIsCalling(false)
    }
  }

 const displayFoods = showFavoritesOnly
  ? (foods || []).filter(food)
  : (foods || [])

  // FILTER FOODS
  const filteredFoods = (displayFoods || []).filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "All" || food.category?.name === selectedCategory
    
    let matchesVeg = true
    if (vegFilter === "veg") matchesVeg = food.isVeg
    else if (vegFilter === "nonveg") matchesVeg = !food.isVeg
    
    let matchesFoodType = true
    if (selectedFilters.foodType.length > 0) {
      matchesFoodType = selectedFilters.foodType.some(type => {
        if (type === "veg") return food.isVeg
        if (type === "nonveg") return !food.isVeg
        return false
      })
    }
    
    let matchesPrice = true
    if (selectedFilters.priceRange.length > 0) {
      matchesPrice = selectedFilters.priceRange.some(range => {
        if (range === "under100") return food.price < 100
        if (range === "100to250") return food.price >= 100 && food.price <= 250
        if (range === "250to500") return food.price > 250 && food.price <= 500
        if (range === "above500") return food.price > 500
        return false
      })
    }
    
    let matchesRating = true
    if (selectedFilters.ratings.length > 0) {
      matchesRating = selectedFilters.ratings.some(rating => {
        if (rating === "above4") return (food.rating || 4.5) >= 4
        if (rating === "above3") return (food.rating || 4.5) >= 3
        return false
      })
    }
    
    let matchesPrepTime = true
    if (selectedFilters.prepTime.length > 0) {
      matchesPrepTime = selectedFilters.prepTime.some(time => {
        if (time === "under20") return (food.prepTime || 25) <= 20
        if (time === "20to30") return (food.prepTime || 25) >= 20 && (food.prepTime || 25) <= 30
        if (time === "above30") return (food.prepTime || 25) > 30
        return false
      })
    }
    
    let matchesSpice = true
    if (selectedFilters.spiceLevel.length > 0) {
      matchesSpice = selectedFilters.spiceLevel.includes(food.spiceLevel || "medium")
    }
    
    let matchesBestSeller = true
    if (selectedFilters.bestSellers) {
      matchesBestSeller = food.isPopular
    }
    
    let matchesOffers = true
    if (selectedFilters.offers) {
      matchesOffers = food.hasOffer || false
    }
    
    return matchesSearch && matchesCategory && matchesVeg && matchesFoodType && 
           matchesPrice && matchesRating && matchesPrepTime && matchesSpice && 
           matchesBestSeller && matchesOffers
  })

  

  useEffect(() => {

  const handleScroll = () => {

    const nearBottom =
      window.innerHeight +
      window.scrollY >=
      document.documentElement.scrollHeight - 200

    if (nearBottom) {

      console.log("SCROLL TRIGGERED")

      setVisibleItems((prev) => {

        if (prev >= getSortedFoods().length) {
          return prev
        }

        return prev + 8
      })
    }
  }

  window.addEventListener("scroll", handleScroll)

  return () => {
    window.removeEventListener("scroll", handleScroll)
  }

}, [filteredFoods])

  // Sort foods
  const getSortedFoods = () => {
    let sorted = [...filteredFoods]
    
    if (selectedFilters.sortBy === "priceLow") {
      sorted.sort((a, b) => a.price - b.price)
    } else if (selectedFilters.sortBy === "priceHigh") {
      sorted.sort((a, b) => b.price - a.price)
    } else if (selectedFilters.sortBy === "rating") {
      sorted.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5))
    } else if (selectedFilters.sortBy === "popular") {
      sorted.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
    } else if (selectedFilters.sortBy === "fastServing") {
      sorted.sort((a, b) => (a.prepTime || 25) - (b.prepTime || 25))
    }
    
    return sorted
  }

  const todaySpecials = foods.filter(food => food.isPopular)
  const currentSpecial = todaySpecials[currentSpecialIndex]

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0
    count += selectedFilters.foodType.length
    count += selectedFilters.categories.length
    count += selectedFilters.priceRange.length
    count += selectedFilters.ratings.length
    count += selectedFilters.prepTime.length
    count += selectedFilters.spiceLevel.length
    if (selectedFilters.bestSellers) count++
    if (selectedFilters.offers && selectedFilters.offers) count++
    if (selectedFilters.sortBy !== "recommended") count++
    return count
  }

  const filterSections = [
    { id: "sort", name: "Sort By", icon: "📊" },
    { id: "foodType", name: "Food Type", icon: "🥘" },
    { id: "categories", name: "Categories", icon: "📚" },
    { id: "price", name: "Price", icon: "💰" },
    { id: "ratings", name: "Ratings", icon: "⭐" },
    { id: "prepTime", name: "Prep Time", icon: "⏱️" },
    { id: "spiceLevel", name: "Spice Level", icon: "🌶️" },
    { id: "bestSellers", name: "Best Sellers", icon: "🏆" },
    { id: "offers", name: "Offers", icon: "🎁" }
  ]

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --fp-bg: #f7f4ef;
          --fp-surface: #ffffff;
          --fp-border: #ede9e2;
          --fp-accent: #c84b2f;
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
          --fp-font-display: 'Fraunces', serif;
          --fp-radius-sm: 8px;
          --fp-radius-md: 14px;
          --fp-radius-lg: 20px;
          --fp-radius-xl: 28px;
          --fp-shadow: 0 1px 3px rgba(28,24,20,0.07), 0 4px 12px rgba(28,24,20,0.06);
          --fp-shadow-lg: 0 4px 24px rgba(28,24,20,0.14);
        }

        .fp-root { font-family: var(--fp-font-body); background: var(--fp-bg); min-height: 100vh; color: var(--fp-text); -webkit-font-smoothing: antialiased; }

        /* ── WELCOME SCREEN ── */
        .fp-welcome {
          position: fixed; inset: 0; z-index: 100;
          background: var(--fp-accent);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          animation: fp-welcome-exit 0.6s ease-in-out 3.4s forwards;
        }
        .fp-welcome-logo {
          width: 80px; height: 80px; background: #fff; border-radius: 22px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          animation: fp-logo-pulse 2s ease-in-out infinite;
          box-shadow: 0 0 0 0 rgba(255,255,255,0.4);
        }
        .fp-welcome-logo svg { color: var(--fp-accent); width: 36px; height: 36px; }
        .fp-welcome h1 { font-family: var(--fp-font-display); color: #fff; font-size: 30px; font-weight: 600; letter-spacing: -0.5px; }
        .fp-welcome p { color: rgba(255,255,255,0.75); font-size: 14px; margin-top: 6px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 300; }
        .fp-welcome-dots { display: flex; gap: 6px; margin-top: 36px; }
        .fp-welcome-dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.5); }
        .fp-welcome-dots span:nth-child(1) { animation: fp-dot-bounce 1.2s 0s infinite; }
        .fp-welcome-dots span:nth-child(2) { animation: fp-dot-bounce 1.2s 0.15s infinite; }
        .fp-welcome-dots span:nth-child(3) { animation: fp-dot-bounce 1.2s 0.3s infinite; }

        /* ── SUCCESS TOAST ── */
        .fp-toast {
          position: fixed; top: 16px; left: 12px; right: 12px; z-index: 200;
          background: var(--fp-success);
          border-radius: var(--fp-radius-md);
          padding: 14px 16px;
          display: flex; align-items: center; gap: 12px;
          box-shadow: var(--fp-shadow-lg);
          animation: fp-slide-down 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .fp-toast-icon { color: #fff; flex-shrink: 0; }
        .fp-toast h4 { color: #fff; font-size: 14px; font-weight: 600; }
        .fp-toast p { color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 1px; }

        /* ── STICKY HEADER ── */
        .fp-header {
          position: sticky; top: 0; z-index: 40;
          background: var(--fp-surface);
          border-bottom: 1px solid var(--fp-border);
          padding: 12px 16px;
        }
        .fp-header-inner { display: flex; align-items: center; justify-content: space-between; }
        .fp-brand { display: flex; align-items: center; gap: 10px; }
        .fp-brand-icon {
          width: 42px; height: 42px;
          background: var(--fp-accent);
          border-radius: var(--fp-radius-sm);
          display: flex; align-items: center; justify-content: center;
          position: relative; flex-shrink: 0;
        }
        .fp-brand-icon svg { color: #fff; width: 20px; height: 20px; }
        .fp-brand-dot {
          position: absolute; top: -3px; right: -3px;
          width: 10px; height: 10px; background: #2ecc71;
          border-radius: 50%; border: 2px solid var(--fp-surface);
        }
        .fp-brand-name { font-family: var(--fp-font-display); font-size: 17px; font-weight: 600; color: var(--fp-text); line-height: 1.2; }
        .fp-brand-meta { display: flex; align-items: center; gap: 6px; margin-top: 1px; }
        .fp-brand-meta span { font-size: 11px; color: var(--fp-muted); display: flex; align-items: center; gap: 2px; }
        .fp-cart-btn {
          position: relative; width: 42px; height: 42px;
          background: var(--fp-accent-light);
          border: 1px solid var(--fp-accent-mid);
          border-radius: var(--fp-radius-sm);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: transform 0.15s;
        }
        .fp-cart-btn:active { transform: scale(0.93); }
        .fp-cart-btn svg { color: var(--fp-accent); width: 20px; height: 20px; }
        .fp-cart-badge {
          position: absolute; top: -7px; right: -7px;
          min-width: 20px; height: 20px; padding: 0 5px;
          background: var(--fp-gold); color: #fff;
          font-size: 11px; font-weight: 600;
          border-radius: 10px; border: 2px solid var(--fp-surface);
          display: flex; align-items: center; justify-content: center;
          animation: fp-badge-pop 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }

        /* ── PAGE BODY ── */
        .fp-body { padding: 0 16px 100px; }

        /* ── BANNER ── */
        .fp-banner-wrap { margin-top: 16px; border-radius: var(--fp-radius-lg); overflow: hidden; position: relative; height: 160px; box-shadow: var(--fp-shadow); }
        .fp-banner-slide { position: absolute; inset: 0; transition: opacity 0.55s ease; }
        .fp-banner-slide img { width: 100%; height: 100%; object-fit: cover; }
        .fp-banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,12,5,0.7) 0%, transparent 55%); }
        .fp-banner-text { position: absolute; bottom: 0; left: 0; right: 0; padding: 14px 16px; }
        .fp-banner-text h2 { color: #fff; font-family: var(--fp-font-display); font-size: 18px; font-weight: 600; line-height: 1.2; }
        .fp-banner-text p { color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 2px; }
        .fp-banner-dots { position: absolute; bottom: 10px; right: 14px; display: flex; gap: 5px; z-index: 5; }
        .fp-banner-dot { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.5); transition: all 0.3s; cursor: pointer; }
        .fp-banner-dot.active { width: 18px; background: #fff; }
        .fp-banner-dot:not(.active) { width: 4px; }

        /* ── SEARCH + FILTER ── */
        .fp-search-row { display: flex; gap: 10px; margin-top: 16px; }
        .fp-search-wrap { flex: 1; position: relative; }
        .fp-search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--fp-hint); pointer-events: none; }
        .fp-search-input {
          width: 100%; height: 44px; padding: 0 12px 0 38px;
          background: var(--fp-surface); border: 1px solid var(--fp-border);
          border-radius: var(--fp-radius-md); font-size: 14px; font-family: var(--fp-font-body);
          color: var(--fp-text); outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .fp-search-input::placeholder { color: var(--fp-hint); }
        .fp-search-input:focus { border-color: var(--fp-accent-mid); box-shadow: 0 0 0 3px var(--fp-accent-light); }
        .fp-filter-btn {
          width: 44px; height: 44px; background: var(--fp-accent); border-radius: var(--fp-radius-md);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: none; position: relative; transition: transform 0.15s;
          flex-shrink: 0;
        }
        .fp-filter-btn:active { transform: scale(0.92); }
        .fp-filter-btn svg { color: #fff; width: 18px; height: 18px; }
        .fp-filter-badge {
          position: absolute; top: -6px; right: -6px;
          min-width: 18px; height: 18px; padding: 0 4px;
          background: var(--fp-gold); color: #fff; font-size: 10px; font-weight: 700;
          border-radius: 9px; border: 2px solid var(--fp-bg);
          display: flex; align-items: center; justify-content: center;
        }

        /* ── CATEGORIES ── */
        .fp-section-title { font-size: 13px; font-weight: 600; color: var(--fp-muted); letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 10px; }
        .fp-categories-section { margin-top: 22px; }
        .fp-categories-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .fp-categories-scroll::-webkit-scrollbar { display: none; }
        .fp-cat-pill {
          flex-shrink: 0; display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 50px;
          border: 1px solid var(--fp-border); background: var(--fp-surface);
          font-size: 13px; font-weight: 500; color: var(--fp-muted);
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .fp-cat-pill svg { width: 14px; height: 14px; }
        .fp-cat-pill:hover { border-color: var(--fp-accent-mid); color: var(--fp-accent); }
        .fp-cat-pill.active {
          background: var(--fp-accent); border-color: var(--fp-accent);
          color: #fff; box-shadow: 0 2px 8px rgba(200,75,47,0.3);
        }
        .fp-cat-pill.active svg { color: #fff; }

        /* ── CHEF'S SPECIAL ── */
        .fp-special-section { margin-top: 24px; }
        .fp-special-section-head { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
        .fp-special-section-head svg { width: 15px; height: 15px; color: var(--fp-gold); }
        .fp-special-card { border-radius: var(--fp-radius-lg); overflow: hidden; position: relative; height: 200px; box-shadow: var(--fp-shadow); }
        .fp-special-card img { width: 100%; height: 100%; object-fit: cover; transition: opacity 0.5s; }
        .fp-special-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, transparent 30%, rgba(20,12,5,0.8) 100%); }
        .fp-special-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; }
        .fp-special-badges { display: flex; gap: 6px; margin-bottom: 6px; }
        .fp-badge {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600;
        }
        .fp-badge-gold { background: var(--fp-gold); color: #fff; }
        .fp-badge-ghost { background: rgba(255,255,255,0.18); backdrop-filter: blur(4px); color: #fff; border: 1px solid rgba(255,255,255,0.25); }
        .fp-special-name { font-family: var(--fp-font-display); color: #fff; font-size: 20px; font-weight: 600; line-height: 1.2; }
        .fp-special-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
        .fp-special-price { font-family: var(--fp-font-display); color: #fff; font-size: 22px; font-weight: 600; }
        .fp-special-add-btn {
          background: #fff; color: var(--fp-accent);
          border: none; border-radius: 50px; padding: 8px 18px;
          font-size: 13px; font-weight: 600; font-family: var(--fp-font-body);
          cursor: pointer; transition: all 0.2s;
        }
        .fp-special-add-btn:hover { background: var(--fp-accent); color: #fff; }
        .fp-special-dots { display: flex; justify-content: center; gap: 5px; margin-top: 10px; }
        .fp-special-dot { height: 3px; border-radius: 2px; cursor: pointer; transition: all 0.3s; }
        .fp-special-dot.active { width: 16px; background: var(--fp-accent); }
        .fp-special-dot:not(.active) { width: 4px; background: var(--fp-border); }

        /* ── MENU GRID ── */
        .fp-menu-section { margin-top: 24px; }
        .fp-menu-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .fp-menu-count { font-size: 12px; color: var(--fp-hint); }
        .fp-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media(min-width: 600px) { .fp-grid { grid-template-columns: repeat(3, 1fr); } }
        @media(min-width: 900px) { .fp-grid { grid-template-columns: repeat(4, 1fr); } }
        
        .fp-food-card {
          background: var(--fp-surface); border-radius: var(--fp-radius-md);
          overflow: hidden; box-shadow: var(--fp-shadow);
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid var(--fp-border);
        }
        .fp-food-card:hover { transform: translateY(-2px); box-shadow: var(--fp-shadow-lg); }
        .fp-food-img-wrap { position: relative; height: 120px; overflow: hidden; }
        .fp-food-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .fp-food-card:hover .fp-food-img-wrap img { transform: scale(1.04); }
        .fp-favorite-btn{
  position:absolute;
  top:8px;
  right:8px;
  width:34px;
  height:34px;
  border:none;
  border-radius:50%;
  background:rgba(0,0,0,0.45);
  backdrop-filter:blur(4px);
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  transition:all 0.2s ease;
  z-index:5;
}

.fp-favorite-btn:hover{
  transform:scale(1.08);
}

.fp-favorite-btn:active{
  transform:scale(0.92);
}
        .fp-bestseller-tag {
          position: absolute; top: 8px; left: 8px;
          display: flex; align-items: center; gap: 3px;
          background: var(--fp-gold); color: #fff;
          font-size: 10px; font-weight: 700; padding: 3px 7px; border-radius: 20px;
        }
        .fp-bestseller-tag svg { width: 10px; height: 10px; }
        .fp-food-info { padding: 10px 10px 12px; }
        .fp-food-name { font-weight: 600; font-size: 13px; color: var(--fp-text); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .fp-food-meta { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
        .fp-food-meta-item { display: flex; align-items: center; gap: 3px; font-size: 11px; color: var(--fp-muted); }
        .fp-food-meta-item svg { width: 11px; height: 11px; }
        .fp-food-meta-sep { color: var(--fp-hint); font-size: 10px; }
        .fp-food-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
        .fp-food-price { font-family: var(--fp-font-display); font-size: 16px; font-weight: 600; color: var(--fp-accent); }
        .fp-add-btn {
          display: flex; align-items: center; gap: 4px;
          background: var(--fp-accent-light); color: var(--fp-accent);
          border: 1px solid var(--fp-accent-mid); border-radius: 20px;
          padding: 5px 10px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; font-family: var(--fp-font-body);
        }
        .fp-add-btn svg { width: 12px; height: 12px; }
        .fp-add-btn:hover { background: var(--fp-accent); color: #fff; border-color: var(--fp-accent); }
        .fp-qty-ctrl { display: flex; align-items: center; gap: 6px; background: var(--fp-accent-light); border-radius: 20px; padding: 3px 6px; }
        .fp-qty-btn {
          width: 22px; height: 22px; border-radius: 50%; background: #fff;
          border: 1px solid var(--fp-accent-mid); display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--fp-accent); transition: all 0.15s;
        }
        .fp-qty-btn:hover { background: var(--fp-accent); color: #fff; border-color: var(--fp-accent); }
        .fp-qty-btn svg { width: 11px; height: 11px; }
        .fp-qty-num { font-size: 13px; font-weight: 700; color: var(--fp-accent); min-width: 16px; text-align: center; }

        /* ── EMPTY STATE ── */
        .fp-empty { background: var(--fp-surface); border: 1px solid var(--fp-border); border-radius: var(--fp-radius-lg); padding: 48px 24px; text-align: center; }
        .fp-empty-emoji { font-size: 40px; margin-bottom: 12px; }
        .fp-empty p { color: var(--fp-muted); font-size: 14px; }
        .fp-empty-clear { margin-top: 12px; color: var(--fp-accent); font-size: 13px; font-weight: 600; background: none; border: none; cursor: pointer; font-family: var(--fp-font-body); }

        /* ── FLOATING CART ── */
        .fp-floating-cart {
          position: fixed; bottom: 72px; left: 50%; transform: translateX(-50%);
          width: calc(100% - 32px); max-width: 420px; z-index: 35;
        }
        .fp-floating-cart-btn {
          width: 100%; background: var(--fp-accent);
          border-radius: var(--fp-radius-lg); padding: 14px 18px;
          display: flex; align-items: center; justify-content: space-between;
          cursor: pointer; border: none;
          box-shadow: 0 8px 32px rgba(28,24,20,0.35);
          transition: transform 0.15s;
        }
        .fp-floating-cart-btn:active { transform: scale(0.98); }
        .fp-floating-cart-left { display: flex; align-items: center; gap: 12px; }
        .fp-floating-cart-icon { width: 38px; height: 38px; background: rgba(255,255,255,0.12); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .fp-floating-cart-icon svg { color: #fff; width: 18px; height: 18px; }
        .fp-floating-cart-label { color: #fff; font-size: 14px; font-weight: 600; }
        .fp-floating-cart-sublabel { color: rgba(255,255,255,0.6); font-size: 11px; }
        .fp-floating-cart-right { text-align: right; }
        .fp-floating-cart-total { font-family: var(--fp-font-display); color: #fff; font-size: 18px; font-weight: 600; }
        .fp-floating-cart-cta { display: flex; align-items: center; gap: 2px; color: rgba(255,255,255,0.6); font-size: 11px; justify-content: flex-end; }
        .fp-floating-cart-cta svg { width: 12px; height: 12px; }

        /* ── BOTTOM NAV ── */
        .fp-bottom-nav {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
          background: var(--fp-surface); border-top: 1px solid var(--fp-border);
          padding: 6px 0 8px;
        }
        .fp-nav-inner { display: flex; justify-content: space-around; }
        .fp-nav-btn {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 6px 14px; background: none; border: none; cursor: pointer;
          position: relative; transition: transform 0.15s;
        }
        .fp-nav-btn:active { transform: scale(0.9); }
        .fp-nav-btn svg { width: 22px; height: 22px; color: var(--fp-hint); transition: color 0.2s; }
        .fp-nav-btn.active svg { color: var(--fp-accent); }
        .fp-nav-label { font-size: 10px; font-weight: 500; color: var(--fp-hint); transition: color 0.2s; font-family: var(--fp-font-body); }
        .fp-nav-btn.active .fp-nav-label { color: var(--fp-accent); }
        .fp-nav-indicator { position: absolute; bottom: -6px; width: 18px; height: 2px; background: var(--fp-accent); border-radius: 1px; }

        /* ── OVERLAYS ── */
        .fp-overlay {
          position: fixed; inset: 0; z-index: 50;
          background: var(--fp-overlay); backdrop-filter: blur(3px);
          animation: fp-fade-in 0.25s;
        }

        /* ── BOTTOM SHEET ── */
        .fp-sheet {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: var(--fp-surface); border-radius: var(--fp-radius-xl) var(--fp-radius-xl) 0 0;
          animation: fp-slide-up 0.35s cubic-bezier(0.22,1,0.36,1);
          max-height: 90vh; overflow: hidden; display: flex; flex-direction: column;
        }
        .fp-sheet-handle { width: 36px; height: 4px; background: var(--fp-border); border-radius: 2px; margin: 10px auto 0; }
        .fp-sheet-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 12px; border-bottom: 1px solid var(--fp-border); }
        .fp-sheet-title { font-family: var(--fp-font-display); font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .fp-sheet-title svg { width: 18px; height: 18px; color: var(--fp-accent); }
        .fp-sheet-close { width: 32px; height: 32px; background: var(--fp-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; }
        .fp-sheet-close svg { width: 16px; height: 16px; color: var(--fp-muted); }
        .fp-sheet-footer { padding: 14px 16px; border-top: 1px solid var(--fp-border); display: flex; gap: 10px; }
        .fp-btn-outline { flex: 1; padding: 12px; border: 1px solid var(--fp-border); border-radius: var(--fp-radius-md); font-size: 14px; font-weight: 600; color: var(--fp-muted); background: none; cursor: pointer; font-family: var(--fp-font-body); transition: background 0.2s; }
        .fp-btn-outline:hover { background: var(--fp-bg); }
        .fp-btn-primary { flex: 1; padding: 12px; background: var(--fp-accent); border: none; border-radius: var(--fp-radius-md); font-size: 14px; font-weight: 600; color: #fff; cursor: pointer; font-family: var(--fp-font-body); transition: opacity 0.2s; }
        .fp-btn-primary:hover { opacity: 0.88; }
        .fp-btn-success { flex: 1; padding: 12px; background: var(--fp-success); border: none; border-radius: var(--fp-radius-md); font-size: 14px; font-weight: 600; color: #fff; cursor: pointer; font-family: var(--fp-font-body); transition: opacity 0.2s; }

        /* ── FILTER SHEET ── */
        .fp-filter-body { display: flex; flex: 1; overflow: hidden; }
        .fp-filter-sidebar { width: 38%; background: var(--fp-bg); overflow-y: auto; border-right: 1px solid var(--fp-border); }
        .fp-filter-sidebar-btn { width: 100%; text-align: left; padding: 14px 16px; border: none; background: none; cursor: pointer; font-size: 13px; color: var(--fp-muted); font-family: var(--fp-font-body); position: relative; transition: all 0.15s; display: flex; align-items: center; gap: 8px; }
        .fp-filter-sidebar-btn.active { background: var(--fp-surface); color: var(--fp-accent); font-weight: 600; }
        .fp-filter-sidebar-btn.active::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--fp-accent); border-radius: 0 2px 2px 0; }
        .fp-filter-panel { width: 62%; overflow-y: auto; padding: 16px; }
        .fp-filter-group-title { font-size: 13px; font-weight: 600; color: var(--fp-text); margin-bottom: 12px; }
        .fp-filter-option { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid var(--fp-border); cursor: pointer; }
        .fp-filter-option:last-child { border-bottom: none; }
        .fp-filter-option-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--fp-text); }
        .fp-filter-radio, .fp-filter-check {
          width: 18px; height: 18px; accent-color: var(--fp-accent); cursor: pointer;
        }

        /* ── CART DRAWER ── */
        .fp-cart-drawer {
          position: absolute; right: 0; top: 0; bottom: 0; width: 100%; max-width: 420px;
          background: var(--fp-surface); display: flex; flex-direction: column;
          animation: fp-slide-in-right 0.3s cubic-bezier(0.22,1,0.36,1);
          box-shadow: -8px 0 40px rgba(28,24,20,0.15);
        }
        .fp-cart-header { background: var(--fp-accent); padding: 18px 18px 16px; flex-shrink: 0; }
        .fp-cart-header-inner { display: flex; align-items: flex-start; justify-content: space-between; }
        .fp-cart-title { font-family: var(--fp-font-display); color: #fff; font-size: 22px; font-weight: 600; }
        .fp-cart-subtitle { color: rgba(255,255,255,0.7); font-size: 13px; margin-top: 2px; }
        .fp-cart-close { width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; }
        .fp-cart-close svg { color: #fff; width: 16px; height: 16px; }
        .fp-cart-items { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
        .fp-cart-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 40px 20px; }
        .fp-cart-empty-icon { width: 72px; height: 72px; background: var(--fp-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .fp-cart-empty-icon svg { width: 32px; height: 32px; color: var(--fp-hint); }
        .fp-cart-empty p { color: var(--fp-muted); font-size: 14px; font-weight: 500; }
        .fp-cart-empty small { color: var(--fp-hint); font-size: 12px; }
.fp-cart-item{
  display:flex;
  align-items:center;
  gap:12px;
  background:var(--fp-bg);
  border-radius:16px;
  padding:12px;
  border:1px solid var(--fp-border);
}        .fp-cart-item img { width: 70px; height: 70px; object-fit: cover; border-radius: var(--fp-radius-sm); flex-shrink: 0; }
        .fp-cart-item-info { flex: 1; min-width: 0; }
        .fp-cart-item-name { font-weight: 600; font-size: 14px; color: var(--fp-text); }
        .fp-cart-item-sub { font-size: 11px; color: var(--fp-muted); margin-top: 2px; }
        .fp-cart-item-price { font-family: var(--fp-font-display); font-size: 17px; font-weight: 600; color: var(--fp-accent); margin-top: 4px; }
.fp-cart-item-actions{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-top:8px;
  width:100%;
}        .fp-cart-remove { margin-left: auto; display: flex; align-items: center; gap: 4px; font-size: 12px; color: #e74c3c; background: none; border: none; cursor: pointer; font-family: var(--fp-font-body); }
        .fp-cart-remove svg { width: 12px; height: 12px; }
        .fp-cart-footer { padding: 16px; border-top: 1px solid var(--fp-border); background: var(--fp-surface); }
.fp-cart-total-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  width:100%;
  margin-bottom:14px;
}        .fp-cart-total-label { font-size: 14px; color: var(--fp-muted); }
.fp-cart-total-amount{
  font-family:var(--fp-font-display);
  font-size:28px;
  font-weight:700;
  color:var(--fp-accent);
  text-align:right;
}        
.fp-checkout-btn{
  width:100%;
  background:var(--fp-accent);
  color:#fff;
  border:none;
  border-radius:16px;
  padding:16px 18px;
  font-size:15px;
  font-weight:600;
  cursor:pointer;

  display:flex;
  align-items:center;
  justify-content:space-between;
}
          .fp-checkout-btn:hover { opacity: 0.88; }
        .fp-checkout-btn svg { width: 16px; height: 16px; }

        /* ── MODAL (centered) ── */
        .fp-modal-wrap { position: fixed; inset: 0; z-index: 60; background: var(--fp-overlay); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fp-fade-in 0.2s; }
        .fp-modal { background: var(--fp-surface); border-radius: var(--fp-radius-xl); padding: 28px 24px 24px; width: 100%; max-width: 380px; animation: fp-scale-in 0.25s cubic-bezier(0.22,1,0.36,1); }
        .fp-modal-icon { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .fp-modal-icon-accent { background: var(--fp-accent-light); }
        .fp-modal-icon-accent svg { color: var(--fp-accent); width: 26px; height: 26px; }
        .fp-modal-icon-green { background: var(--fp-success-bg); }
        .fp-modal-icon-green svg { color: var(--fp-success); width: 26px; height: 26px; }
        .fp-modal-title { font-family: var(--fp-font-display); font-size: 20px; font-weight: 600; text-align: center; color: var(--fp-text); }
        .fp-modal-subtitle { font-size: 13px; color: var(--fp-muted); text-align: center; margin-top: 4px; }
        .fp-modal-inputs { display: flex; flex-direction: column; gap: 10px; margin-top: 18px; }
        .fp-input {
          width: 100%; padding: 12px 14px; border: 1px solid var(--fp-border); border-radius: var(--fp-radius-md);
          font-size: 14px; font-family: var(--fp-font-body); color: var(--fp-text); background: var(--fp-surface);
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .fp-input::placeholder { color: var(--fp-hint); }
        .fp-input:focus { border-color: var(--fp-accent-mid); box-shadow: 0 0 0 3px var(--fp-accent-light); }
        .fp-table-display {
          padding: 12px 14px; background: var(--fp-bg); border-radius: var(--fp-radius-md);
          border: 1px solid var(--fp-border);
          display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--fp-text);
        }
        .fp-table-display svg { width: 16px; height: 16px; color: var(--fp-muted); }
        .fp-modal-actions { display: flex; gap: 10px; margin-top: 20px; }

        /* ── BILL / TRACK SHEET ── */
        .fp-order-card { border: 1px solid var(--fp-border); border-radius: var(--fp-radius-md); padding: 14px; }
        .fp-order-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .fp-order-id { font-size: 13px; font-weight: 700; color: var(--fp-accent); display: flex; align-items: center; gap: 5px; }
        .fp-order-card{
  background:#fff;
  border:1px solid var(--fp-border);
  border-radius:18px;
  padding:16px;
  margin-bottom:14px;
  box-shadow:var(--fp-shadow);
}

.fp-order-status-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:12px;
}

.fp-order-divider{
  height:1px;
  background:var(--fp-border);
  margin:12px 0;
}

.fp-order-total{
  display:flex;
  justify-content:space-between;
  align-items:center;
  font-size:16px;
  font-weight:700;
}

.fp-order-time{
  font-size:12px;
  color:var(--fp-muted);
  margin-top:4px;
}

.fp-order-empty{
  text-align:center;
  padding:50px 20px;
}

.fp-order-empty svg{
  width:60px;
  height:60px;
  color:var(--fp-hint);
  margin-bottom:12px;
}
        .fp-order-id svg { width: 13px; height: 13px; }
        .fp-status-pill { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: capitalize; }
        .fp-status-pending { background: #fff8e6; color: #b8740a; }
        .fp-status-preparing { background: #e6f0ff; color: #2052a3; }
        .fp-status-completed { background: var(--fp-success-bg); color: var(--fp-success); }
        .fp-status-default { background: var(--fp-bg); color: var(--fp-muted); }
        .fp-order-item-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; color: var(--fp-text); }
        .fp-order-total-row { display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; border-top: 1px solid var(--fp-border); padding-top: 10px; margin-top: 6px; }
.fp-grand-total-card{
  position:sticky;
  bottom:0;
  background:linear-gradient(
    135deg,
    var(--fp-accent),
    #b93f25
  );

  border-radius:20px;
  padding:18px 20px;
  display:flex;
  justify-content:space-between;
  align-items:center;

  margin-top:10px;

  box-shadow:0 10px 30px rgba(200,75,47,.3);
}  
        .fp-grand-total-label { color: #fff; font-size: 15px; font-weight: 600; }
.fp-grand-total-amount{
  font-family:var(--fp-font-display);
  color:#fff;
  font-size:32px;
  font-weight:700;
  min-width:90px;
  text-align:right;
}        .fp-sheet-scroll { flex: 1; overflow-y: auto; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }

.fp-info-hero{
  display:flex;
  align-items:center;
  gap:14px;
  background:var(--fp-accent-light);
  border:1px solid var(--fp-accent-mid);
  border-radius:18px;
  padding:18px;
  margin-bottom:16px;
}

.fp-info-logo{
  width:58px;
  height:58px;
  border-radius:16px;
  background:var(--fp-accent);
  display:flex;
  align-items:center;
  justify-content:center;
  color:white;
  flex-shrink:0;
}

.fp-info-hero h3{
  font-size:18px;
  font-weight:700;
  color:var(--fp-text);
}

.fp-info-hero p{
  font-size:13px;
  color:var(--fp-muted);
  margin-top:4px;
}

.fp-info-card{
  display:flex;
  align-items:flex-start;
  gap:14px;
  padding:16px;
  border-radius:16px;
  background:white;
  border:1px solid var(--fp-border);
  margin-bottom:12px;
}

.fp-info-icon{
  width:42px;
  height:42px;
  border-radius:12px;
  background:var(--fp-accent-light);
  color:var(--fp-accent);
  display:flex;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
}

.fp-info-label{
  font-size:12px;
  font-weight:600;
  color:var(--fp-muted);
  margin-bottom:4px;
}

.fp-info-value{
  font-size:14px;
  font-weight:600;
  color:var(--fp-text);
}

.fp-info-about{
  margin-top:8px;
  padding:18px;
  background:white;
  border-radius:16px;
  border:1px solid var(--fp-border);
}

.fp-info-about h4{
  font-size:15px;
  font-weight:700;
  margin-bottom:8px;
}

.fp-info-about p{
  font-size:13px;
  line-height:1.7;
  color:var(--fp-muted);
}

.fp-orders-count{
  margin-left:8px;
  background:var(--fp-accent);
  color:#fff;
  font-size:11px;
  padding:3px 8px;
  border-radius:20px;
}

.fp-order-progress{
  display:flex;
  gap:6px;
  margin:12px 0;
}

.fp-progress-step{
  flex:1;
  height:5px;
  border-radius:20px;
  background:#ececec;
}

.fp-progress-step.active{
  background:var(--fp-success);
}

.fp-reorder-btn{
  margin-top:12px;
  width:100%;
  border:none;
  background:var(--fp-accent-light);
  color:var(--fp-accent);
  padding:10px;
  border-radius:12px;
  font-weight:600;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
}

.fp-reorder-btn:hover{
  background:var(--fp-accent);
  color:#fff;
}
  .fp-order-card{
  background:#fff;
  border:1px solid var(--fp-border);
  border-radius:18px;
  padding:16px;
  margin-bottom:14px;
  box-shadow:var(--fp-shadow);
}

.fp-order-header{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
}

.fp-order-id{
  display:flex;
  align-items:center;
  gap:6px;
  font-weight:700;
  color:var(--fp-text);
}

.fp-order-time{
  font-size:12px;
  color:var(--fp-muted);
  margin-top:4px;
}

.fp-order-divider{
  height:1px;
  background:var(--fp-border);
  margin:12px 0;
}

.fp-order-item-row{
  display:flex;
  justify-content:space-between;
  margin-bottom:10px;
  font-size:14px;
}

.fp-order-total{
  display:flex;
  justify-content:space-between;
  align-items:center;
  font-size:15px;
  font-weight:700;
}

.fp-order-total strong{
  color:var(--fp-accent);
  font-size:18px;
}

.fp-order-card{
  background:#fff;
  border:2px dashed #e5e5e5;
  border-radius:20px;
  padding:18px;
  margin-bottom:16px;
  box-shadow:0 4px 18px rgba(0,0,0,.05);
}

.fp-order-header{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
}

.fp-order-id{
  font-size:16px;
  font-weight:700;
  color:var(--fp-text);
}

.fp-order-time{
  font-size:12px;
  color:var(--fp-muted);
  margin-top:4px;
}

.fp-order-divider{
  height:1px;
  background:repeating-linear-gradient(
    to right,
    #ddd 0,
    #ddd 8px,
    transparent 8px,
    transparent 14px
  );
  margin:14px 0;
}

.fp-order-item-row{
  display:flex;
  justify-content:space-between;
  padding:8px 0;
  font-size:14px;
}

.fp-order-total{
  display:flex;
  justify-content:space-between;
  align-items:center;
  font-size:16px;
  font-weight:700;
}

.fp-order-total strong{
  color:var(--fp-accent);
  font-size:20px;
}

.fp-orders-summary{
  display:flex;
  align-items:center;
  gap:12px;
  background:var(--fp-accent-light);
  border:1px solid var(--fp-accent-mid);
  border-radius:16px;
  padding:16px;
  margin-bottom:14px;
}

.fp-orders-summary h3{
  margin:0;
  font-size:16px;
  font-weight:700;
}

.fp-orders-summary p{
  margin:2px 0 0;
  font-size:12px;
  color:var(--fp-muted);
}

        /* ── ANIMATIONS ── */
        @keyframes fp-welcome-exit { 0%{opacity:1} 100%{opacity:0;pointer-events:none;} }
        @keyframes fp-logo-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0.4)} 50%{box-shadow:0 0 0 12px rgba(255,255,255,0)} }
        @keyframes fp-dot-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes fp-slide-down { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes fp-slide-up { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes fp-slide-in-right { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes fp-fade-in { from{opacity:0} to{opacity:1} }
        @keyframes fp-scale-in { from{transform:scale(0.9);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fp-badge-pop { from{transform:scale(0)} to{transform:scale(1)} }
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
            <span /><span /><span />
          </div>
        </div>
      )}

      {/* Toast */}
      {showOrderSuccess && (
        <div className="fp-toast">
          <CheckCircle className="fp-toast-icon" size={22} />
          <div>
            <h4>Order placed successfully!</h4>
            <p>Your order has been sent to the kitchen</p>
          </div>
        </div>
      )}

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
                  <span><MapPin size={10} /> Main Street</span>
                  <span style={{color:'var(--fp-hint)'}}>·</span>
                  <span style={{color:'#2d9e5a'}}><Star size={10} style={{fill:'#2d9e5a',color:'#2d9e5a'}} /> 4.8</span>
                </div>
              </div>
            </div>
            <button
  className="fp-cart-btn"
  onClick={() => {
    console.log("INFO CLICKED")
    setShowInfoModal(true)
  }}
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
                <img src={` ${import.meta.env.VITE_API_URL}${banner.image}`} alt={banner.title} />
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
                  className={`fp-banner-dot ${idx === currentBannerIndex ? 'active' : ''}`}
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
}}                className="fp-search-input"
              />
            </div>
            <button className="fp-filter-btn" onClick={() => setShowFilterModal(true)}>
              <SlidersHorizontal />
              {getActiveFiltersCount() > 0 && <span className="fp-filter-badge">{getActiveFiltersCount()}</span>}
            </button>
          </div>

          {showFavoritesOnly && (
  <div
    style={{
      marginTop: "18px",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
    }}
  >

    <div>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "var(--fp-text)",
        }}
      >
        Your Favorites ❤️
      </h3>

      <p
        style={{
          fontSize: "13px",
          color: "var(--fp-muted)",
          marginTop: "2px",
        }}
      >
        {favorites.length} favorite items
      </p>
    </div>

    <button
      onClick={() => setShowFavoritesOnly(false)}
      style={{
        border: "none",
        background: "var(--fp-accent)",
        color: "white",
        padding: "10px 16px",
        borderRadius: "12px",
        fontWeight: "600",
        cursor: "pointer",
      }}
    >
      Back
    </button>
  </div>
)}

          {/* Categories */}
          <div className="fp-categories-section">
            <div className="fp-section-title">Browse</div>
            <div className="fp-categories-scroll" ref={categoriesScrollRef}>
              <button
                onClick={() => {
  setSelectedCategory("All")
  setVisibleItems(8)
}}
                className={`fp-cat-pill  ${selectedCategory === "All" ? 'active' : ''}`}
              >
                <UtensilsCrossed size={14} />
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
onClick={() => {
  setSelectedCategory(category.name)
  setVisibleItems(8)
}}                  className={`fp-cat-pill ${selectedCategory === category.name ? 'active' : ''}`}
                >
                  {categoryIcons[category.name] || <UtensilsCrossed size={14} />}
                  {category.name.length > 10 ? category.name.slice(0,9)+'…' : category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chef's Special */}
          {todaySpecials.length > 0 && currentSpecial && (
            <div className="fp-special-section">
              <div className="fp-special-section-head">
                <ChefHat />
                <span className="fp-section-title" style={{marginBottom:0}}>Chef's Special</span>
              </div>
              <div className="fp-special-card">
                <img
                  src={` ${import.meta.env.VITE_API_URL}${currentSpecial?.image}`}
                  alt={currentSpecial?.name}
                />
                <div className="fp-special-overlay" />
                <div className="fp-special-content">
                  <div className="fp-special-badges">
                    <span className="fp-badge fp-badge-gold"><Star size={10} style={{fill:'#fff'}} /> {currentSpecial?.rating || 4.5}</span>
                    <span className="fp-badge fp-badge-ghost">{currentSpecial?.isVeg ? "Vegetarian" : "Non-Veg"}</span>
                  </div>
                  <div className="fp-special-name">{currentSpecial?.name}</div>
                  <div className="fp-special-footer">
                    <span className="fp-special-price">₹{currentSpecial?.price}</span>
                    <button
                      id={`add-btn-${currentSpecial?._id}`}
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
                  <button key={idx} onClick={() => setCurrentSpecialIndex(idx)} className={`fp-special-dot ${idx === currentSpecialIndex ? 'active' : ''}`} />
                ))}
              </div>
            </div>
          )}

          {/* Menu Grid */}
          <div className="fp-menu-section">
            <div className="fp-menu-head">
              <div className="fp-section-title" style={{marginBottom:0}}>Our Menu</div>
              <span className="fp-menu-count">{getSortedFoods().length} items</span>
            </div>

            {getSortedFoods().length === 0 ? (
              <div className="fp-empty">
                <div className="fp-empty-emoji">😢</div>
                <p>No items match your filters</p>
                <button
                  className="fp-empty-clear"
                  onClick={() => {
                    setSelectedFilters({ sortBy:"recommended", foodType:[], categories:[], priceRange:[], ratings:[], prepTime:[], spiceLevel:[], bestSellers:false, offers:false, availability:"all" })
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
  {filteredFoods
    .slice(0, visibleItems)
    .map((food) => {
                  const cartItem = cart.find(item => item._id === food._id)
                  return (
                    <div key={food._id} className="fp-food-card">
                      <div className="fp-food-img-wrap">
                        <img src={` ${import.meta.env.VITE_API_URL}${food.image}`} alt={food.name} />
                        <button
  className="fp-favorite-btn"
  onClick={() => toggleFavorite(food)}
>
  <Heart
    size={16}
    fill={
      favorites.find(
        (item) => item._id === food._id
      )
        ? "#ef4444"
        : "transparent"
    }
    color={
      favorites.find(
        (item) => item._id === food._id
      )
        ? "#ef4444"
        : "white"
    }
  />
</button>
                        {food.isPopular && (
                          <div className="fp-bestseller-tag">
                            <Award size={10} /> Bestseller
                          </div>
                        )}
                      </div>
                      <div className="fp-food-info">
                        <div className="fp-food-name">{food.name}</div>
                        <div className="fp-food-meta">
                          <span className="fp-food-meta-item">
                            <Star size={11} style={{fill:'#f59e0b',color:'#f59e0b'}} />
                            {food.rating || 4.5}
                          </span>
                          <span className="fp-food-meta-sep">·</span>
                          <span className="fp-food-meta-item">
                            <Clock size={11} />
                            {food.prepTime || 20}m
                          </span>
                        </div>
                        <div className="fp-food-footer">
                          <span className="fp-food-price">₹{food.price}</span>
                          {cartItem ? (
                            <div className="fp-qty-ctrl">
                              <button className="fp-qty-btn" onClick={() => updateQuantity(food._id, cartItem.quantity - 1)}><Minus /></button>
                              <span className="fp-qty-num">{cartItem.quantity}</span>
                              <button className="fp-qty-btn" onClick={() => updateQuantity(food._id, cartItem.quantity + 1)}><Plus /></button>
                            </div>
                          ) : (
                            <button id={`add-btn-${food._id}`} className="fp-add-btn" onClick={() => addToCart(food)}>
                              <Plus /> Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
            )}
            <div className="fp-grid">

  {getSortedFoods()
    .slice(0, visibleItems)
    .map((food) => {

      // food card code

  })}

</div>


          </div>
        </div>

        {/* Floating Cart */}
        {cart.length > 0 && (
          <div className="fp-floating-cart">
            <button className="fp-floating-cart-btn" onClick={() => setIsCartOpen(true)}>
              <div className="fp-floating-cart-left">
                <div className="fp-floating-cart-icon"><ShoppingBag /></div>
                <div>
                  <div className="fp-floating-cart-label">{getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''} added</div>
                  <div className="fp-floating-cart-sublabel">Tap to view cart</div>
                </div>
              </div>
              <div className="fp-floating-cart-right">
                <div className="fp-floating-cart-total">₹{getCartTotal()}</div>
                <div className="fp-floating-cart-cta">View Cart <ChevronRight /></div>
              </div>
            </button>
          </div>
        )}


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
          <ClipboardList />
          Your Orders
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

    <Receipt size={22} />

    <div>
      <h3>Order Summary</h3>

      <p>
        Track all your placed orders
      </p>
    </div>

  </div>

  {activeOrders.map((order, index) => (
  <div
    key={index}
    className="fp-order-card"
  >
    <div className="fp-order-header">

      <div>
        <div className="fp-order-id">
          <ClipboardList size={16} />
          Order #{order.orderId || index + 1}
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

    {order.items?.map((item, i) => (
      <div
        key={i}
        className="fp-order-item-row"
      >
        <span>
          {item.name} × {item.quantity}
        </span>

        <strong>
          ₹{item.price * item.quantity}
        </strong>
      </div>
    ))}

    <div className="fp-order-divider" />

    <div className="fp-order-total">
      <span>Total Amount</span>

      <strong>
        ₹{order.totalAmount || order.total}
      </strong>
    </div>
  </div>
))}

<div className="fp-grand-total-card">

  <div>
    <div className="fp-grand-total-label">
      Grand Total
    </div>

    <small
      style={{
        color: "rgba(255,255,255,.8)"
      }}
    >
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



        {/* Favorites Modal */}
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

      {/* Header */}
      <div className="fp-sheet-header">

        <div className="fp-sheet-title">
          <Heart size={18} />
          Your Favorites
        </div>

        <button
          className="fp-sheet-close"
          onClick={() => setShowFavoritesModal(false)}
        >
          <X />
        </button>

      </div>

      {/* Body */}
      <div className="fp-sheet-scroll">

        {favorites.length === 0 ? (

          <div className="fp-cart-empty">

            <div className="fp-cart-empty-icon">
              <Heart />
            </div>

            <p>No favorites yet</p>

            <small>
              Add your favorite foods ❤️
            </small>

            <button
              className="fp-btn-primary"
              style={{
                marginTop: "16px",
                width: "100%",
              }}
              onClick={() =>
                setShowFavoritesModal(false)
              }
            >
              Browse Menu
            </button>

          </div>

        ) : (

          <>
            {favorites.map((food) => {

              const cartItem = cart.find(
                (item) => item._id === food._id
              )

              return (

                <div
                  key={food._id}
                  className="fp-cart-item"
                >

                  <img
                    src={` ${import.meta.env.VITE_API_URL}${food.image}`}
                    alt={food.name}
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

                    <div
                      className="fp-cart-item-actions"
                    >

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
                            <Minus />
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
                            <Plus />
                          </button>

                        </div>

                      ) : (

                        <button
                          className="fp-add-btn"
                          onClick={() =>
                            addToCart(food)
                          }
                        >
                          <Plus />
                          Add
                        </button>

                      )}

                      <button
                        className="fp-cart-remove"
                        onClick={() =>
                          toggleFavorite(food)
                        }
                      >
                        <Trash2 />
                        Remove
                      </button>

                    </div>

                  </div>

                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  </div>
)}

        {/* Bottom Nav */}
        <div className="fp-bottom-nav">
          <div className="fp-nav-inner">
            {[
  {
    id: "home",
    icon: <Home />,
    label: "Home",
  },

  {
    id: "orders",
    icon: <ClipboardList />,
    label: "Orders",
  },

  {
    id: "favorites",
    icon: <Heart />,
    label: "Favorites",
  },

  {
    id: "call",
    icon: <Phone />,
    label: "Call",
  },
].map((tab) => (
              <button
                key={tab.id}
                className={`fp-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
  setActiveTab(tab.id)

  // HOME
  if (tab.id === "home") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // ORDERS
  if (tab.id === "orders") {
    setShowOrdersModal(true)
  }


  // FAVORITES
if (tab.id === "favorites") {
  setShowFavoritesModal(true)
}

  // CALL
  if (tab.id === "call") {
    setShowCallModal(true)
  }
}}
              >
                {tab.icon}
                <span className="fp-nav-label">{tab.label}</span>
                {activeTab === tab.id && <div className="fp-nav-indicator" />}
              </button>
            ))}
          </div>
        </div>

        {/* ── FILTER SHEET ── */}
        {showFilterModal && (
          <div className="fp-overlay" onClick={() => setShowFilterModal(false)}>
            <div className="fp-sheet" onClick={e => e.stopPropagation()} style={{maxHeight:'92vh'}}>
              <div className="fp-sheet-handle" />
              <div className="fp-sheet-header">
                <div className="fp-sheet-title"><SlidersHorizontal /> Filter Foods</div>
                <button className="fp-sheet-close" onClick={() => setShowFilterModal(false)}><X /></button>
              </div>
              <div className="fp-filter-body" style={{flex:1,overflow:'hidden'}}>
                <div className="fp-filter-sidebar">
                  {filterSections.map(s => (
                    <button key={s.id} className={`fp-filter-sidebar-btn ${activeFilterSection === s.id ? 'active' : ''}`} onClick={() => setActiveFilterSection(s.id)}>
                      <span>{s.icon}</span> {s.name}
                    </button>
                  ))}
                </div>
                <div className="fp-filter-panel">
                  {activeFilterSection === "sort" && (
                    <div>
                      <div className="fp-filter-group-title">Sort By</div>
                      {[{id:"recommended",label:"Recommended"},{id:"priceLow",label:"Price: Low to High"},{id:"priceHigh",label:"Price: High to Low"},{id:"rating",label:"Top Rated"},{id:"popular",label:"Most Popular"},{id:"fastServing",label:"Fast Serving"}].map(o => (
                        <label key={o.id} className="fp-filter-option">
                          <span className="fp-filter-option-label">{o.label}</span>
                          <input type="radio" name="sortBy" className="fp-filter-radio" checked={selectedFilters.sortBy === o.id} onChange={() => setSelectedFilters({...selectedFilters, sortBy: o.id})} />
                        </label>
                      ))}
                    </div>
                  )}
                  {activeFilterSection === "foodType" && (
                    <div>
                      <div className="fp-filter-group-title">Food Type</div>
                      {[{id:"veg",label:"Vegetarian",icon:"🥬"},{id:"nonveg",label:"Non-Vegetarian",icon:"🍗"}].map(o => (
                        <label key={o.id} className="fp-filter-option">
                          <span className="fp-filter-option-label"><span>{o.icon}</span>{o.label}</span>
                          <input type="checkbox" className="fp-filter-check" checked={selectedFilters.foodType.includes(o.id)} onChange={() => { const n = selectedFilters.foodType.includes(o.id) ? selectedFilters.foodType.filter(t=>t!==o.id) : [...selectedFilters.foodType,o.id]; setSelectedFilters({...selectedFilters,foodType:n}) }} />
                        </label>
                      ))}
                    </div>
                  )}
                  {activeFilterSection === "categories" && (
                    <div>
                      <div className="fp-filter-group-title">Categories</div>
                      {categories.map(cat => (
                        <label key={cat._id} className="fp-filter-option">
                          <span className="fp-filter-option-label">{cat.name}</span>
                          <input type="checkbox" className="fp-filter-check" checked={selectedFilters.categories.includes(cat.name)} onChange={() => { const n = selectedFilters.categories.includes(cat.name) ? selectedFilters.categories.filter(c=>c!==cat.name) : [...selectedFilters.categories,cat.name]; setSelectedFilters({...selectedFilters,categories:n}) }} />
                        </label>
                      ))}
                    </div>
                  )}
                  {activeFilterSection === "price" && (
                    <div>
                      <div className="fp-filter-group-title">Price Range</div>
                      {[{id:"under100",label:"Under ₹100"},{id:"100to250",label:"₹100 – ₹250"},{id:"250to500",label:"₹250 – ₹500"},{id:"above500",label:"Above ₹500"}].map(o => (
                        <label key={o.id} className="fp-filter-option">
                          <span className="fp-filter-option-label">{o.label}</span>
                          <input type="checkbox" className="fp-filter-check" checked={selectedFilters.priceRange.includes(o.id)} onChange={() => { const n = selectedFilters.priceRange.includes(o.id) ? selectedFilters.priceRange.filter(p=>p!==o.id) : [...selectedFilters.priceRange,o.id]; setSelectedFilters({...selectedFilters,priceRange:n}) }} />
                        </label>
                      ))}
                    </div>
                  )}
                  {activeFilterSection === "ratings" && (
                    <div>
                      <div className="fp-filter-group-title">Minimum Rating</div>
                      {[{id:"above4",label:"⭐ 4.0 & above"},{id:"above3",label:"⭐ 3.0 & above"}].map(o => (
                        <label key={o.id} className="fp-filter-option">
                          <span className="fp-filter-option-label">{o.label}</span>
                          <input type="checkbox" className="fp-filter-check" checked={selectedFilters.ratings.includes(o.id)} onChange={() => { const n = selectedFilters.ratings.includes(o.id) ? selectedFilters.ratings.filter(r=>r!==o.id) : [...selectedFilters.ratings,o.id]; setSelectedFilters({...selectedFilters,ratings:n}) }} />
                        </label>
                      ))}
                    </div>
                  )}
                  {activeFilterSection === "prepTime" && (
                    <div>
                      <div className="fp-filter-group-title">Preparation Time</div>
                      {[{id:"under20",label:"Under 20 minutes"},{id:"20to30",label:"20 – 30 minutes"},{id:"above30",label:"Above 30 minutes"}].map(o => (
                        <label key={o.id} className="fp-filter-option">
                          <span className="fp-filter-option-label">{o.label}</span>
                          <input type="checkbox" className="fp-filter-check" checked={selectedFilters.prepTime.includes(o.id)} onChange={() => { const n = selectedFilters.prepTime.includes(o.id) ? selectedFilters.prepTime.filter(t=>t!==o.id) : [...selectedFilters.prepTime,o.id]; setSelectedFilters({...selectedFilters,prepTime:n}) }} />
                        </label>
                      ))}
                    </div>
                  )}
                  {activeFilterSection === "spiceLevel" && (
                    <div>
                      <div className="fp-filter-group-title">Spice Level</div>
                      {[{id:"mild",label:"Mild",icon:"😊"},{id:"medium",label:"Medium",icon:"😐"},{id:"spicy",label:"Spicy",icon:"🔥"},{id:"extraSpicy",label:"Extra Spicy",icon:"🌶️🌶️"}].map(o => (
                        <label key={o.id} className="fp-filter-option">
                          <span className="fp-filter-option-label"><span>{o.icon}</span>{o.label}</span>
                          <input type="checkbox" className="fp-filter-check" checked={selectedFilters.spiceLevel.includes(o.id)} onChange={() => { const n = selectedFilters.spiceLevel.includes(o.id) ? selectedFilters.spiceLevel.filter(s=>s!==o.id) : [...selectedFilters.spiceLevel,o.id]; setSelectedFilters({...selectedFilters,spiceLevel:n}) }} />
                        </label>
                      ))}
                    </div>
                  )}
                  {activeFilterSection === "bestSellers" && (
                    <div>
                      <div className="fp-filter-group-title">Best Sellers</div>
                      <label className="fp-filter-option">
                        <span className="fp-filter-option-label">Show only best sellers</span>
                        <input type="checkbox" className="fp-filter-check" checked={selectedFilters.bestSellers} onChange={() => setSelectedFilters({...selectedFilters, bestSellers: !selectedFilters.bestSellers})} />
                      </label>
                    </div>
                  )}
                  {activeFilterSection === "offers" && (
                    <div>
                      <div className="fp-filter-group-title">Offers</div>
                      <label className="fp-filter-option">
                        <span className="fp-filter-option-label">Show items with offers</span>
                        <input type="checkbox" className="fp-filter-check" checked={selectedFilters.offers} onChange={() => setSelectedFilters({...selectedFilters, offers: !selectedFilters.offers})} />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div className="fp-sheet-footer">
                <button className="fp-btn-outline" onClick={() => setSelectedFilters({sortBy:"recommended",foodType:[],categories:[],priceRange:[],ratings:[],prepTime:[],spiceLevel:[],bestSellers:false,offers:false,availability:"all"})}>Clear All</button>
                <button className="fp-btn-primary" onClick={() => setShowFilterModal(false)}>Show {getSortedFoods().length} Foods</button>
              </div>
            </div>
          </div>
        )}

        {/* ── TABLE / ORDER MODAL ── */}
        {showTableModal && (
          <div className="fp-modal-wrap" onClick={() => setShowTableModal(false)}>
            <div className="fp-modal" onClick={e => e.stopPropagation()}>
              <div className="fp-modal-icon fp-modal-icon-accent"><ShoppingBag /></div>
              <div className="fp-modal-title">Place Your Order</div>
              <div className="fp-modal-subtitle">Confirm your details to proceed</div>
              <div className="fp-modal-inputs">
                <input type="text" className="fp-input" placeholder="Your Name" value={customerName} onChange={(e) => { setCustomerName(e.target.value); localStorage.setItem("customerName", e.target.value) }} />
                {tableId ? (
                  <div className="fp-table-display"><Users /><span>Table Number: #{tableId}</span></div>
                ) : (
                  <input type="number" className="fp-input" placeholder="Table Number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                )}
              </div>
              <div className="fp-modal-actions">
                <button className="fp-btn-outline" onClick={() => { setShowTableModal(false); setCustomerName(""); if (!tableId) setTableNumber(""); setIsCartOpen(false) }}>Cancel</button>
                <button className="fp-btn-primary" onClick={placeOrder}>Place Order</button>
              </div>
            </div>
          </div>
        )}

        {/* ── WAITER CALL MODAL ── */}
        {showCallModal && (
          <div className="fp-modal-wrap" onClick={() => setShowCallModal(false)}>
            <div className="fp-modal" onClick={e => e.stopPropagation()}>
             <div className="fp-modal-icon fp-modal-icon-accent"><Phone /></div>
              <div className="fp-modal-title">Call Waiter</div>
              <div className="fp-modal-subtitle">Request assistance at your table</div>
              <div className="fp-modal-inputs">
                <input type="text" className="fp-input" placeholder="Your Name" value={customerName} onChange={(e) => { setCustomerName(e.target.value); localStorage.setItem("customerName", e.target.value) }} />
                {tableId ? (
                  <div className="fp-table-display"><Users /><span>Table Number: #{tableId}</span></div>
                ) : (
                  <input type="number" className="fp-input" placeholder="Table Number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                )}
              </div>
              <div className="fp-modal-actions">
                <button className="fp-btn-outline" onClick={() => { setShowCallModal(false); setCustomerName(""); if (!tableId) setTableNumber("") }}>Cancel</button>
<button
  className="fp-btn-primary"
  onClick={async () => {
    await handleCallWaiter()
    setShowCallModal(false)
  }}
>
  {isCalling ? "Calling…" : "Call Waiter"}
</button>              </div>
            </div>
          </div>
        )}

        {/* ── CART DRAWER ── */}
        {isCartOpen && (
          <div className="fp-overlay" onClick={() => setIsCartOpen(false)}>
            <div className="fp-cart-drawer" onClick={e => e.stopPropagation()}>
              <div className="fp-cart-header">
                <div className="fp-cart-header-inner">
                  <div>
                    <div className="fp-cart-title">Your Cart</div>
                    <div className="fp-cart-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''} selected</div>
                  </div>
                  <button className="fp-cart-close" onClick={() => setIsCartOpen(false)}><X /></button>
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="fp-cart-empty">
                  <div className="fp-cart-empty-icon"><ShoppingBag /></div>
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
/>
                        <div className="fp-cart-item-info">
                          <div className="fp-cart-item-name">{item.name}</div>
                          <div className="fp-cart-item-sub">
                            <span style={{display:'flex',alignItems:'center',gap:3}}><Star size={10} style={{fill:'#f59e0b',color:'#f59e0b'}}/>{item.rating||4.5}</span>
                            {" · "}{item.isVeg ? "Vegetarian" : "Non-Veg"}
                          </div>
<div className="fp-cart-item-price">
 ₹{Number(item.price) * Number(item.quantity)}
</div>                          <div className="fp-cart-item-actions">
                            <div className="fp-qty-ctrl">
                              <button className="fp-qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}><Minus /></button>
                              <span className="fp-qty-num">{item.quantity}</span>
                              <button className="fp-qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}><Plus /></button>
                            </div>
                            <button className="fp-cart-remove" onClick={() => removeFromCart(item._id)}><Trash2 /> Remove</button>
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
    <span>
      Proceed to Order
    </span>

    <strong>
      ₹{getCartTotal()}
    </strong>
  </button>

</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── BILL MODAL ── */}
        {showBillModal && (
          <div className="fp-overlay" onClick={() => setShowBillModal(false)}>
            <div className="fp-sheet" onClick={e => e.stopPropagation()}>
              <div className="fp-sheet-handle" />
              <div className="fp-sheet-header">
                <div className="fp-sheet-title"><Receipt /> Final Bill</div>
                <button className="fp-sheet-close" onClick={() => setShowBillModal(false)}><X /></button>
              </div>
              <div className="fp-sheet-scroll">
                {activeOrders.map((order) => (
                  <div key={order._id} className="fp-order-card">
                    <div className="fp-order-id"><Receipt size={13} />{order.orderId}</div>
                    {order.items.map((item, index) => (
                      <div key={index} className="fp-order-item-row">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="fp-grand-total-card">

  <div>
    <div className="fp-grand-total-label">
      Grand Total
    </div>

    <small
      style={{
        color: "rgba(255,255,255,.8)"
      }}
    >
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
          <Building2 />
          Restaurant Information
        </div>

        <button
          className="fp-sheet-close"
          onClick={() => setShowInfoModal(false)}
        >
          <X />
        </button>
      </div>

      <div className="fp-sheet-scroll">

        {/* Restaurant Hero */}
        <div className="fp-info-hero">
          <div className="fp-info-logo">
            <UtensilsCrossed size={28} />
          </div>

          <div>
            <h3>Aura Kitchen</h3>
            <p>Premium Dining Experience</p>
          </div>
        </div>

        {/* Rating */}
        <div className="fp-info-card">
          <div className="fp-info-icon">
            <Star size={18} />
          </div>

          <div>
            <div className="fp-info-label">
              Customer Rating
            </div>

            <div className="fp-info-value">
              4.8 / 5.0
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="fp-info-card">
          <div className="fp-info-icon">
            <MapPin size={18} />
          </div>

          <div>
            <div className="fp-info-label">
              Address
            </div>

            <div className="fp-info-value">
              Main Street, Coimbatore
            </div>
          </div>
        </div>

        {/* Timings */}
        <div className="fp-info-card">
          <div className="fp-info-icon">
            <Clock3 size={18} />
          </div>

          <div>
            <div className="fp-info-label">
              Opening Hours
            </div>

            <div className="fp-info-value">
              10:00 AM - 11:00 PM
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="fp-info-card">
          <div className="fp-info-icon">
            <Phone size={18} />
          </div>

          <div>
            <div className="fp-info-label">
              Contact Number
            </div>

            <div className="fp-info-value">
              +91 9876543210
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="fp-info-card">
          <div className="fp-info-icon">
            <Mail size={18} />
          </div>

          <div>
            <div className="fp-info-label">
              Email
            </div>

            <div className="fp-info-value">
              foodie@gmail.com
            </div>
          </div>
        </div>

        {/* Website */}
        <div className="fp-info-card">
          <div className="fp-info-icon">
            <Globe size={18} />
          </div>

          <div>
            <div className="fp-info-label">
              Website
            </div>

            <div className="fp-info-value">
              www.foodie.com
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="fp-info-card">
          <div className="fp-info-icon">
            <ShieldCheck size={18} />
          </div>

          <div>
            <div className="fp-info-label">
              Services
            </div>

            <div className="fp-info-value">
              Dine-In • Takeaway • Delivery
            </div>
          </div>
        </div>

        {/* About */}
        <div className="fp-info-about">
          <h4>About Restaurant</h4>

          <p>
            Aura Kitchen is dedicated to delivering
            high-quality food with exceptional customer
            service and a memorable dining experience.
          </p>
        </div>

      </div>
    </div>
  </div>
)}

        {/* ── TRACK ORDERS MODAL ── */}
        {showTrackOrders && (
          <div className="fp-overlay" onClick={() => setShowTrackOrders(false)}>
            <div className="fp-sheet" onClick={e => e.stopPropagation()}>
              <div className="fp-sheet-handle" />
              <div className="fp-sheet-header">
                <button className="fp-sheet-close" onClick={() => setShowTrackOrders(false)}><X /></button>
              </div>
              <div className="fp-sheet-scroll">
                {activeOrders.map((order) => (
                  <div key={order._id} className="fp-order-card">
                    <div className="fp-order-card-head">
                      <div className="fp-order-id"><Receipt size={13} />{order.orderId}</div>
                      <span className={`fp-status-pill ${
                        order.status === "pending" ? "fp-status-pending" :
                        order.status === "preparing" ? "fp-status-preparing" :
                        order.status === "completed" ? "fp-status-completed" : "fp-status-default"
                      }`}>{order.status}</span>
                    </div>
                    {order.items.map((item, index) => (
                      <div key={index} className="fp-order-item-row">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="fp-order-divider" />

<div className="fp-order-total">
  <span>Order Total</span>

  <strong>
    ₹{order.totalAmount}
  </strong>
</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

export default MenuPage