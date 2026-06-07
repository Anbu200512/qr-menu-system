import { Phone, Users } from "lucide-react";

function DesktopCallPanel({
  customerName,
  setCustomerName,
  tableId,
  tableNumber,
  setTableNumber,
  handleCallWaiter,
  isCalling,
  setDesktopPanel,
}) {
  return (
    <div className="dc-wrapper">
      <div className="dc-icon">
        <Phone size={32} />
      </div>

      <h3 className="dc-title">Need Assistance?</h3>

      <p className="dc-subtitle">Our staff will reach your table shortly.</p>

      <div className="dc-form">
        <input
          type="text"
          placeholder="Enter Your Name"
          value={customerName}
          className="dc-input"
          onChange={(e) => {
            setCustomerName(e.target.value);
            localStorage.setItem("customerName", e.target.value);
          }}
        />

        {tableId ? (
          <div className="dc-table-box">
            <Users size={16} />
            <span>Table #{tableId}</span>
          </div>
        ) : (
          <input
            type="number"
            placeholder="Enter Table Number"
            value={tableNumber}
            className="dc-input"
            onChange={(e) => setTableNumber(e.target.value)}
          />
        )}
      </div>

      <div className="dc-actions">
        <button className="dc-cancel-btn" onClick={() => setDesktopPanel(null)}>
          Cancel
        </button>

        <button
          className="dc-call-btn"
          onClick={async () => {
            await handleCallWaiter();
            setDesktopPanel(null);
          }}
          disabled={isCalling}
        >
          {isCalling ? "Calling..." : "Call Waiter"}
        </button>
      </div>
    </div>
  );
}

export default DesktopCallPanel;
