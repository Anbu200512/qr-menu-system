import {
  ShoppingBag,
  Users,
} from "lucide-react"

function TableOrderModal({
  showTableModal,
  setShowTableModal,
  customerName,
  setCustomerName,
  tableNumber,
  setTableNumber,
  placeOrder,
  tableId,
  setIsCartOpen,
}) {
  if (!showTableModal) return null

  return (
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

        <div className="fp-modal-title">
          Place Your Order
        </div>

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
              setCustomerName(
                e.target.value
              )

              localStorage.setItem(
                "customerName",
                e.target.value
              )
            }}
          />

          {tableId ? (
            <div className="fp-table-display">
              <Users size={14} />

              <span>
                Table Number: #{tableId}
              </span>
            </div>
          ) : (
            <input
              type="number"
              className="fp-input"
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) =>
                setTableNumber(
                  e.target.value
                )
              }
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

          <button
            className="fp-btn-primary"
            onClick={placeOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
}

export default TableOrderModal