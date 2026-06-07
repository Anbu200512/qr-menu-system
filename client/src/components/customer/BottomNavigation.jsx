import {
  Home,
  ClipboardList,
  Heart,
  Phone,
} from "lucide-react"

function BottomNavigation({
  activeTab,
  setActiveTab,
  setShowFavoritesModal,
  setShowOrdersModal,
  setShowCallModal,
}) {
  return (
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

  )
}

export default BottomNavigation