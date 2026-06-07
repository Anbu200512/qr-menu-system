import {
  Receipt,
  X,
} from "lucide-react"

function BillModal({
  showBillModal,
  setShowBillModal,
  activeOrders,
  combinedBillTotal,
}) {
  if (!showBillModal) return null

  return (
    <div
      className="fp-overlay"
      onClick={() => setShowBillModal(false)}
    >
      <div
        className="fp-sheet"
        onClick={(e) => e.stopPropagation()}
      >
       
                       <div className="fp-sheet-handle" />
                       <div className="fp-sheet-header">
                         <div className="fp-sheet-title">
                           <Receipt /> Final Bill
                         </div>
                         <button
                           className="fp-sheet-close"
                           onClick={() => setShowBillModal(false)}
                         >
                           <X />
                         </button>
                       </div>
                       <div className="fp-sheet-scroll">
                         {activeOrders.map((order) => (
                           <div key={order._id} className="fp-order-card">
                             <div className="fp-order-id">
                               <Receipt size={12} /> {order.orderId}
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
      

export default BillModal