import {
  UtensilsCrossed,
  Star,
  MapPin,
  Clock3,
  Phone,
  Mail,
  Globe,
  ShieldCheck,
} from "lucide-react";

function DesktopInfoPanel() {
  const infoItems = [
    {
      icon: <Star size={18} />,
      label: "Rating",
      value: "4.8 / 5.0",
    },
    {
      icon: <MapPin size={18} />,
      label: "Address",
      value: "Main Street, Coimbatore",
    },
    {
      icon: <Clock3 size={18} />,
      label: "Hours",
      value: "10:00 AM – 11:00 PM",
    },
    {
      icon: <Phone size={18} />,
      label: "Phone",
      value: "+91 9876543210",
    },
    {
      icon: <Mail size={18} />,
      label: "Email",
      value: "foodie@gmail.com",
    },
    {
      icon: <Globe size={18} />,
      label: "Website",
      value: "www.foodie.com",
    },
    {
      icon: <ShieldCheck size={18} />,
      label: "Services",
      value: "Dine-In • Takeaway • Delivery",
    },
  ];

  return (
    <div className="di-wrapper">
      {/* Restaurant Card */}
      <div className="di-hero">
        <div className="di-logo">
          <UtensilsCrossed size={28} />
        </div>

        <h3>Aura Kitchen</h3>

        <p>Premium Dining Experience</p>
      </div>

      {/* Info Cards */}
      <div className="di-grid">
        {infoItems.map((item, index) => (
          <div key={index} className="di-card">
            <div className="di-icon">{item.icon}</div>

            <div>
              <div className="di-label">{item.label}</div>

              <div className="di-value">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="di-about">
        <h4>About Us</h4>

        <p>
          Aura Kitchen is dedicated to serving exceptional food, warm
          hospitality, and memorable dining experiences for every guest.
        </p>
      </div>
    </div>
  );
}

export default DesktopInfoPanel;
