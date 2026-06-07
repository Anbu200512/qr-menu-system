import {
  X,
  Receipt,
} from "lucide-react"

function TrackOrdersModal({
  showTrackOrders,
  setShowTrackOrders,
  activeOrders,
}) {
  if (!showTrackOrders) return null

  return (
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
         
        
      )
}

export default TrackOrdersModal