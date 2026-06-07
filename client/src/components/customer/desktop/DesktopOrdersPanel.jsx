import { ClipboardList, Receipt } from "lucide-react";

function DesktopOrdersPanel({ activeOrders, combinedBillTotal }) {
  if (activeOrders.length === 0) {
    return (
      <div className="do-empty">
        <div className="do-empty-icon">
          <ClipboardList size={34} />
        </div>

        <h3>No Orders Yet</h3>

        <p>Your placed orders will appear here</p>
      </div>
    );
  }

  return (
    <div className="do-wrapper">
      {activeOrders.map((order) => (
        <div key={order._id || order.orderId} className="do-card">
          <div className="do-card-header">
            <div>
              <div className="do-order-id">
                <Receipt size={14} />
                Order #{order.orderId}
              </div>

              <div className="do-order-items">
                {order.items?.length || 0} Items
              </div>
            </div>

            <span
              className={`do-status ${
                order.status === "completed"
                  ? "do-completed"
                  : order.status === "preparing"
                    ? "do-preparing"
                    : "do-pending"
              }`}
            >
              {order.status || "Pending"}
            </span>
          </div>

          <div className="do-items">
            {order.items?.map((item) => (
              <div key={`${item.name}-${item.price}`} className="do-item">
                <span>
                  {item.name} × {item.quantity}
                </span>

                <strong>₹{item.price * item.quantity}</strong>
              </div>
            ))}
          </div>

          <div className="do-total">
            <span>Total</span>

            <strong>₹{order.totalAmount || order.total}</strong>
          </div>
        </div>
      ))}

      <div className="do-grand-total">
        <span>Grand Total</span>

        <strong>₹{combinedBillTotal}</strong>
      </div>
    </div>
  );
}

export default DesktopOrdersPanel;
