import {
  X,
  Building2,
  UtensilsCrossed,
  Star,
  MapPin,
  Clock3,
  Phone,
  Mail,
  Globe,
  ShieldCheck,
} from "lucide-react"

function RestaurantInfoModal({
  showInfoModal,
  setShowInfoModal,
}) {
  if (!showInfoModal) return null

  return (
    
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
          )
        }

export default RestaurantInfoModal