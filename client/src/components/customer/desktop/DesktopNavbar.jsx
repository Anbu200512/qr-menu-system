import {
  UtensilsCrossed,
  Search,
  Home,
  ClipboardList,
  Heart,
  Phone,
  ShoppingBag,
  Building2,
} from "lucide-react"

function DesktopNavbar({
  search,
  setSearch,
  setVisibleItems,
  desktopPanel,
  setDesktopPanel,
  activeOrders,
  favorites,
  cart,
  getCartItemCount,
}) {
  return (
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
        <div
          className="dp-nav-search"
          style={{ margin: "0 auto" }}
        >
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

        {/* Nav Links */}
        <div className="dp-nav-links">
          <button
            className={`dp-nav-btn ${
              desktopPanel === null
                ? "dp-active"
                : ""
            }`}
            onClick={() =>
              setDesktopPanel(null)
            }
          >
            <Home size={18} />
            <span className="dp-nav-btn-label">
              Home
            </span>
          </button>

          <button
            className={`dp-nav-btn ${
              desktopPanel === "orders"
                ? "dp-active"
                : ""
            }`}
            onClick={() =>
              setDesktopPanel(
                desktopPanel === "orders"
                  ? null
                  : "orders"
              )
            }
          >
            <ClipboardList size={18} />
            <span className="dp-nav-btn-label">
              Orders
            </span>

            {activeOrders.length > 0 && (
              <span className="dp-nav-badge">
                {activeOrders.length}
              </span>
            )}
          </button>

          <button
            className={`dp-nav-btn ${
              desktopPanel === "favorites"
                ? "dp-active"
                : ""
            }`}
            onClick={() =>
              setDesktopPanel(
                desktopPanel === "favorites"
                  ? null
                  : "favorites"
              )
            }
          >
            <Heart size={18} />
            <span className="dp-nav-btn-label">
              Saved
            </span>

            {favorites.length > 0 && (
              <span className="dp-nav-badge">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            className={`dp-nav-btn ${
              desktopPanel === "call"
                ? "dp-active"
                : ""
            }`}
            onClick={() =>
              setDesktopPanel(
                desktopPanel === "call"
                  ? null
                  : "call"
              )
            }
          >
            <Phone size={18} />
            <span className="dp-nav-btn-label">
              Call
            </span>
          </button>

          <button
            className={`dp-nav-btn ${
              desktopPanel === "cart"
                ? "dp-active"
                : ""
            }`}
            onClick={() =>
              setDesktopPanel(
                desktopPanel === "cart"
                  ? null
                  : "cart"
              )
            }
          >
            <ShoppingBag size={18} />
            <span className="dp-nav-btn-label">
              Cart
            </span>

            {cart.length > 0 && (
              <span className="dp-nav-badge">
                {getCartItemCount()}
              </span>
            )}
          </button>

          <button
            className={`dp-nav-btn ${
              desktopPanel === "info"
                ? "dp-active"
                : ""
            }`}
            onClick={() =>
              setDesktopPanel(
                desktopPanel === "info"
                  ? null
                  : "info"
              )
            }
          >
            <Building2 size={18} />
            <span className="dp-nav-btn-label">
              Info
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default DesktopNavbar