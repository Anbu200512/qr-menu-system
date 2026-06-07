import {
  ClipboardList,
  Receipt,
  X,
} from "lucide-react"

function OrdersModal({
  showOrdersModal,
  setShowOrdersModal,
  activeOrders,
  combinedBillTotal,
}) {
  if (!showOrdersModal) return null


  return (
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
                
  )
}

export default OrdersModal