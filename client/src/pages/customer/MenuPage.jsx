import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createOrder } from "../../services/orderService";
import { createWaiterCall } from "../../services/waiterCallService";

import BannerSlider from "../../components/customer/BannerSlider";
import BillModal from "../../components/customer/BillModal";
import BottomNavigation from "../../components/customer/BottomNavigation";
import CallWaiterModal from "../../components/customer/CallWaiterModal";
import CartDrawer from "../../components/customer/CartDrawer";
import CategoryTabs from "../../components/customer/CategoryTabs";
import ChefSpecial from "../../components/customer/ChefSpecial";
import DesktopPanel from "../../components/customer/desktop/DesktopPanel";
import FavoritesModal from "../../components/customer/FavoritesModal";
import FilterSheet from "../../components/customer/FilterSheet";
import FloatingCart from "../../components/customer/FloatingCart";
import LoadingScreen from "../../components/customer/LoadingScreen";
import MenuGrid from "../../components/customer/MenuGrid";
import OrdersModal from "../../components/customer/OrdersModal";
import RestaurantInfoModal from "../../components/customer/RestaurantInfoModal";
import TableOrderModal from "../../components/customer/TableOrderModal";
import TrackOrdersModal from "../../components/customer/TrackOrdersModal";

import DesktopCallPanel from "../../components/customer/desktop/DesktopCallPanel";
import DesktopCartPanel from "../../components/customer/desktop/DesktopCartPanel";
import DesktopFavoritesPanel from "../../components/customer/desktop/DesktopFavoritesPanel";
import DesktopFilters from "../../components/customer/desktop/DesktopFilters";
import DesktopInfoPanel from "../../components/customer/desktop/DesktopInfoPanel";
import DesktopNavbar from "../../components/customer/desktop/DesktopNavbar";
import DesktopOrdersPanel from "../../components/customer/desktop/DesktopOrdersPanel";

import "./MenuPage.css";

import useCart from "../../hooks/useCart";
import useFoodFilters from "../../hooks/useFoodFilters";
import useMenuData from "../../hooks/useMenuData";

import {
  Building2,
  CheckCircle,
  ChefHat,
  ClipboardList,
  Coffee,
  Heart,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  UtensilsCrossed,
  Zap,
} from "lucide-react";

function MenuPage() {
  const { foods, categories, banners, advertisements, loading } = useMenuData();

  const customerSessionRef = useRef("");

  const {
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
  } = useCart(customerSessionRef);

  const { tableId } = useParams();

  const [showWaiterSuccess, setShowWaiterSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [vegFilter, setVegFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("home");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showTrackOrders, setShowTrackOrders] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [tableNumber, setTableNumber] = useState(tableId || "");
  const [customerName, setCustomerName] = useState("");
  const [customerSessionId, setCustomerSessionId] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentSpecialIndex, setCurrentSpecialIndex] = useState(0);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeFilterSection, setActiveFilterSection] = useState("sort");
  const [visibleItems, setVisibleItems] = useState(8);

  // Desktop panel state — null | 'orders' | 'favorites' | 'call' | 'cart' | 'info'
  const [desktopPanel, setDesktopPanel] = useState(null);

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
  });

  const categoriesScrollRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!customerSessionId) return;
    fetchActiveOrder();
    const interval = setInterval(() => fetchActiveOrder(), 15000);
    return () => clearInterval(interval);
  }, [customerSessionId]);

  useEffect(() => {
    if (banners.length === 0) return;
    const bannerInterval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(bannerInterval);
  }, [banners.length]);

  useEffect(() => {
    const specialItems = foods.filter((f) => f.isPopular);
    if (specialItems.length > 0) {
      const specialInterval = setInterval(() => {
        setCurrentSpecialIndex((prev) => (prev + 1) % specialItems.length);
      }, 4000);
      return () => clearInterval(specialInterval);
    }
  }, [foods]);

  const [activeOrders, setActiveOrders] = useState([]);
  const fetchActiveOrder = async () => {
    try {
      const currentSessionId = customerSessionRef.current;
      if (!currentSessionId) return;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/session/${currentSessionId}`,
      );
      if (response.data.success) {
        setActiveOrders(response.data.orders || []);
      }
    } catch (error) {
      console.log(error);
      setActiveOrders([]);
    }
  };

  useEffect(() => {
    const savedName = sessionStorage.getItem(`customerName_${tableId}`);
    if (savedName) setCustomerName(savedName);

    let savedCustomerSession = sessionStorage.getItem("customerSessionId");
    if (!savedCustomerSession) {
      savedCustomerSession = `CUS-${tableId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      sessionStorage.setItem("customerSessionId", savedCustomerSession);
    }
    setCustomerSessionId(savedCustomerSession);
    customerSessionRef.current = savedCustomerSession;
    loadCartFromStorage();

    const favoriteKey = `favoriteFoods_${savedCustomerSession}`;
    const savedFavorites = localStorage.getItem(favoriteKey);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    } else {
      setFavorites([]);
    }
  }, []);

  const combinedBillTotal = activeOrders.reduce(
    (total, order) => total + order.totalAmount,
    0,
  );

  const placeOrder = async () => {
    if (!tableId) {
      alert("Please scan restaurant table QR to place dine-in order 🍽️");
      return;
    }
    if (!customerName.trim()) {
      alert("Please enter your name");
      return;
    }
    const finalTableNumber = tableId || tableNumber;
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    try {
      const orderDetails = {
        orderId: "ORD-" + Math.floor(Math.random() * 900000),
        customerSessionId,
        customerName,
        tableNumber: finalTableNumber,
        items: cart,
        totalAmount: getCartTotal(),
      };
      await createOrder(orderDetails);
      sessionStorage.setItem(`customerName_${tableId}`, customerName);
      fetchActiveOrder();
      setShowOrderSuccess(true);
      saveCartToStorage([]);
      setCart([]);
      setShowTableModal(false);
      if (!tableId) setTableNumber("");
      setIsCartOpen(false);
      if (isDesktop) setDesktopPanel(null);
      setTimeout(() => setShowOrderSuccess(false), 3000);
    } catch (error) {
      console.log(error);
      alert("Failed to place order");
    }
  };

  const handleCallWaiter = async () => {
    if (!tableId) {
      alert("Please scan restaurant table QR to call waiter 🕒");
      return;
    }
    if (!customerName) {
      alert("Enter your name");
      return;
    }
    const finalTableNumber = tableId || tableNumber;
    try {
      setIsCalling(true);
      await createWaiterCall({ customerName, tableNumber: finalTableNumber });
      setShowWaiterSuccess(true);
      setTimeout(() => setShowWaiterSuccess(false), 3000);
      setShowCallModal(false);
      setTableNumber("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsCalling(false);
    }
  };

  const displayFoods = showFavoritesOnly
    ? foods.filter((food) => favorites.some((fav) => fav._id === food._id))
    : foods;

  const { filteredFoods, getSortedFoods, getActiveFiltersCount } =
    useFoodFilters({
      displayFoods,
      search,
      selectedCategory,
      vegFilter,
      selectedFilters,
    });

const activeAds = advertisements.filter(
  (ad) => ad.isActive
);

useEffect(() => {
  if (activeAds.length <= 1) return;

  const timer = setInterval(() => {
    setCurrentAdIndex((prev) =>
      (prev + 1) % activeAds.length
    );
  }, 3000);

  return () => clearInterval(timer);
}, [activeAds.length]);

useEffect(() => {
  if (currentAdIndex >= activeAds.length) {
    setCurrentAdIndex(0);
  }
}, [activeAds.length, currentAdIndex]);

const activeAd =
  activeAds[currentAdIndex] || null;

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200;
      if (nearBottom) {
        setVisibleItems((prev) => {
          if (prev >= getSortedFoods().length) return prev;
          return prev + 8;
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredFoods]);

  const todaySpecials = foods.filter((food) => food.isPopular);
  const currentSpecial = todaySpecials[currentSpecialIndex];

  const categoryIcons = {
    All: <Coffee size={16} />,
    Pizza: <ChefHat size={16} />,
    Burger: <Zap size={16} />,
    Drinks: <Coffee size={16} />,
    Desserts: <Star size={16} />,
  };

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
  ];

  // LOADING
  if (loading) {
    return <LoadingScreen />;
  }

  // ── DESKTOP RIGHT PANEL CONTENT ──
  const renderDesktopPanelContent = () => {
    if (desktopPanel === "orders") {
      return (
        <DesktopOrdersPanel
          activeOrders={activeOrders}
          combinedBillTotal={combinedBillTotal}
        />
      );
    }

    if (desktopPanel === "favorites") {
      return (
        <DesktopFavoritesPanel
          favorites={favorites}
          cart={cart}
          addToCart={addToCart}
          updateQuantity={updateQuantity}
          toggleFavorite={toggleFavorite}
        />
      );
    }

    if (desktopPanel === "call") {
      return (
        <DesktopCallPanel
          customerName={customerName}
          setCustomerName={setCustomerName}
          tableId={tableId}
          tableNumber={tableNumber}
          setTableNumber={setTableNumber}
          handleCallWaiter={handleCallWaiter}
          isCalling={isCalling}
          setDesktopPanel={setDesktopPanel}
        />
      );
    }

    if (desktopPanel === "cart") {
      return (
        <DesktopCartPanel
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          getCartTotal={getCartTotal}
          setShowTableModal={setShowTableModal}
        />
      );
    }

    if (desktopPanel === "info") {
      return <DesktopInfoPanel />;
    }

    return null;
  };

  const panelMeta = {
    orders: { icon: <ClipboardList size={16} />, title: "Your Orders" },
    favorites: { icon: <Heart size={16} />, title: "Favourites" },
    call: { icon: <Phone size={16} />, title: "Call Waiter" },
    cart: { icon: <ShoppingBag size={16} />, title: "Your Cart" },
    info: { icon: <Building2 size={16} />, title: "Restaurant Info" },
  };

  return (
    <>
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
      <DesktopNavbar
        search={search}
        setSearch={setSearch}
        setVisibleItems={setVisibleItems}
        desktopPanel={desktopPanel}
        setDesktopPanel={setDesktopPanel}
        activeOrders={activeOrders}
        favorites={favorites}
        cart={cart}
        getCartItemCount={getCartItemCount}
      />

      {/* Desktop Three-Column Body */}
      <div className={`dp-layout ${desktopPanel ? "dp-has-panel" : ""}`}>
        {/* ── LEFT: Filters Sidebar ── */}
        <DesktopFilters
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          activeFilterSection={activeFilterSection}
          setActiveFilterSection={setActiveFilterSection}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          setSearch={setSearch}
          getActiveFiltersCount={getActiveFiltersCount}
        />

        {/* ── CENTER: Main Menu Content ── */}
        <main className="dp-content">
          {/* Banner */}
          <BannerSlider
            banners={banners}
            currentBannerIndex={currentBannerIndex}
            setCurrentBannerIndex={setCurrentBannerIndex}
          />

          {/* Categories */}
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setVisibleItems={setVisibleItems}
            categoryIcons={categoryIcons}
          />

          {/* Chef's Special */}
          <ChefSpecial
            currentSpecial={currentSpecial}
            todaySpecials={todaySpecials}
            currentSpecialIndex={currentSpecialIndex}
            setCurrentSpecialIndex={setCurrentSpecialIndex}
            addToCart={addToCart}
          />

          {/* Menu Grid */}
          <MenuGrid
            foods={getSortedFoods()}
            visibleItems={visibleItems}
            cart={cart}
            favorites={favorites}
            addToCart={addToCart}
            updateQuantity={updateQuantity}
            toggleFavorite={toggleFavorite}
            setSelectedFilters={setSelectedFilters}
            setSearch={setSearch}
            setSelectedCategory={setSelectedCategory}
            setVegFilter={setVegFilter}
          />
        </main>

        {/* ── RIGHT: Panel (shown when desktopPanel !== null) ── */}
        <DesktopPanel
          desktopPanel={desktopPanel}
          renderDesktopPanelContent={renderDesktopPanelContent}
          panelMeta={panelMeta}
          setDesktopPanel={setDesktopPanel}
          activeAd={activeAd}
        />
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
                  <img src={banner.image} alt={banner.title} loading="lazy" />
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
                    setSearch(e.target.value);
                    setVisibleItems(8);
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
            <CategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              setVisibleItems={setVisibleItems}
              categoryIcons={categoryIcons}
            />

            {/* Chef's Special */}
            <ChefSpecial
              currentSpecial={currentSpecial}
              todaySpecials={todaySpecials}
              currentSpecialIndex={currentSpecialIndex}
              setCurrentSpecialIndex={setCurrentSpecialIndex}
              addToCart={addToCart}
            />

            {/* Menu Grid */}
            <MenuGrid
              foods={getSortedFoods()}
              visibleItems={visibleItems}
              cart={cart}
              favorites={favorites}
              addToCart={addToCart}
              updateQuantity={updateQuantity}
              toggleFavorite={toggleFavorite}
              setSelectedFilters={setSelectedFilters}
              setSearch={setSearch}
              setSelectedCategory={setSelectedCategory}
              setVegFilter={setVegFilter}
            />
          </div>

          {/* Floating cart */}
          <FloatingCart
            cart={cart}
            getCartItemCount={getCartItemCount}
            getCartTotal={getCartTotal}
            setIsCartOpen={setIsCartOpen}
          />

          {/* Orders Modal (mobile) */}
          <OrdersModal
            showOrdersModal={showOrdersModal}
            setShowOrdersModal={setShowOrdersModal}
            activeOrders={activeOrders}
            combinedBillTotal={combinedBillTotal}
          />

          {/* Favorites Modal (mobile) */}
          <FavoritesModal
            showFavoritesModal={showFavoritesModal}
            setShowFavoritesModal={setShowFavoritesModal}
            favorites={favorites}
            cart={cart}
            addToCart={addToCart}
            updateQuantity={updateQuantity}
            toggleFavorite={toggleFavorite}
          />

          {/* Bottom Nav */}
          <BottomNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setShowFavoritesModal={setShowFavoritesModal}
            setShowOrdersModal={setShowOrdersModal}
            setShowCallModal={setShowCallModal}
          />

          {/* Filter Sheet (mobile) */}
          <FilterSheet
            showFilterModal={showFilterModal}
            setShowFilterModal={setShowFilterModal}
            filterSections={filterSections}
            activeFilterSection={activeFilterSection}
            setActiveFilterSection={setActiveFilterSection}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            categories={categories}
            getSortedFoods={getSortedFoods}
          />

          {/* Table / Order Modal */}

          {/* Call Waiter Modal */}
          <CallWaiterModal
            showCallModal={showCallModal}
            setShowCallModal={setShowCallModal}
            customerName={customerName}
            setCustomerName={setCustomerName}
            tableId={tableId}
            tableNumber={tableNumber}
            setTableNumber={setTableNumber}
            handleCallWaiter={handleCallWaiter}
            isCalling={isCalling}
          />

          {/* Cart Drawer */}
          <CartDrawer
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            getCartTotal={getCartTotal}
            getCartItemCount={getCartItemCount}
            setShowTableModal={setShowTableModal}
          />

          {/* Info Modal (mobile) */}
          <RestaurantInfoModal
            showInfoModal={showInfoModal}
            setShowInfoModal={setShowInfoModal}
          />

          {/* Bill Modal (mobile) */}
          <BillModal
            showBillModal={showBillModal}
            setShowBillModal={setShowBillModal}
            activeOrders={activeOrders}
            combinedBillTotal={combinedBillTotal}
          />

          {/* Track Orders Modal (mobile) */}
          <TrackOrdersModal
            showTrackOrders={showTrackOrders}
            setShowTrackOrders={setShowTrackOrders}
            activeOrders={activeOrders}
          />
        </div>
      )}

      <TableOrderModal
        showTableModal={showTableModal}
        setShowTableModal={setShowTableModal}
        customerName={customerName}
        setCustomerName={setCustomerName}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        tableId={tableId}
        placeOrder={placeOrder}
      />
    </>
  );
}

export default MenuPage;
