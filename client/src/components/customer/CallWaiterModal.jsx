import {
  Phone,
  Users,
} from "lucide-react"

function CallWaiterModal({
  showCallModal,
  setShowCallModal,
  customerName,
  setCustomerName,
  tableId,
  tableNumber,
  setTableNumber,
  handleCallWaiter,
  isCalling,
}) {
  if (!showCallModal) return null

  return (
    <div
      className="fp-modal-wrap"
      onClick={() =>
        setShowCallModal(false)
      }
    >
      <div
        className="fp-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
                        <div className="fp-modal-icon fp-modal-icon-accent">
                          <Phone />
                        </div>
                        <div className="fp-modal-title">Call Waiter</div>
                        <div className="fp-modal-subtitle">
                          Request assistance at your table
                        </div>
                        <div className="fp-modal-inputs">
                          <input
                            type="text"
                            className="fp-input"
                            placeholder="Your Name"
                            value={customerName}
                            onChange={(e) => {
                              setCustomerName(e.target.value)
                              localStorage.setItem("customerName", e.target.value)
                            }}
                          />
                          {tableId ? (
                            <div className="fp-table-display">
                              <Users size={14} />
                              <span>Table Number: #{tableId}</span>
                            </div>
                          ) : (
                            <input
                              type="number"
                              className="fp-input"
                              placeholder="Table Number"
                              value={tableNumber}
                              onChange={(e) => setTableNumber(e.target.value)}
                            />
                          )}
                        </div>
                        <div className="fp-modal-actions">
                          <button
                            className="fp-btn-outline"
                            onClick={() => setShowCallModal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="fp-btn-primary"
                            onClick={async () => {
                              await handleCallWaiter()
                              setShowCallModal(false)
                            }}
                          >
                            {isCalling ? "Calling…" : "Call Waiter"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                }

export default CallWaiterModal