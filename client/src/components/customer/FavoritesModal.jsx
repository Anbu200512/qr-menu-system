import {
  Heart,
  X,
  Plus,
  Minus,
  Trash2,
} from "lucide-react"

function FavoritesModal({
  showFavoritesModal,
  setShowFavoritesModal,
  favorites,
  cart,
  addToCart,
  updateQuantity,
  toggleFavorite,
}) {
  if (!showFavoritesModal) return null

  return (
                 <div
                   className="fp-overlay"
                   onClick={() => setShowFavoritesModal(false)}
                 >
                   <div
                     className="fp-sheet"
                     onClick={(e) => e.stopPropagation()}
                   >
                     <div className="fp-sheet-handle" />
                     <div className="fp-sheet-header">
                       <div className="fp-sheet-title">
                         <Heart size={17} /> Your Favorites
                       </div>
                       <button
                         className="fp-sheet-close"
                         onClick={() => setShowFavoritesModal(false)}
                       >
                         <X />
                       </button>
                     </div>
                     <div className="fp-sheet-scroll">
                       {favorites.length === 0 ? (
                         <div className="fp-cart-empty">
                           <div className="fp-cart-empty-icon">
                             <Heart />
                           </div>
                           <p>No favorites yet</p>
                           <small>Add your favorite foods ❤️</small>
                         </div>
                       ) : (
                         favorites.map((food) => {
                           const cartItem = cart.find(
                             (item) => item._id === food._id
                           )
                           return (
                             <div key={food._id} className="fp-cart-item">
                               <img
       src={food.image}
       alt={food.name}
       loading="lazy"
     />
                               <div className="fp-cart-item-info">
                                 <div className="fp-cart-item-name">
                                   {food.name}
                                 </div>
                                 <div className="fp-cart-item-sub">
                                   {food.category?.name}
                                 </div>
                                 <div className="fp-cart-item-price">
                                   ₹{food.price}
                                 </div>
                                 <div className="fp-cart-item-actions">
                                   {cartItem ? (
                                     <div className="fp-qty-ctrl">
                                       <button
                                         className="fp-qty-btn"
                                         onClick={() =>
                                           updateQuantity(
                                             food._id,
                                             cartItem.quantity - 1
                                           )
                                         }
                                       >
                                         <Minus size={10} />
                                       </button>
                                       <span className="fp-qty-num">
                                         {cartItem.quantity}
                                       </span>
                                       <button
                                         className="fp-qty-btn"
                                         onClick={() =>
                                           updateQuantity(
                                             food._id,
                                             cartItem.quantity + 1
                                           )
                                         }
                                       >
                                         <Plus size={10} />
                                       </button>
                                     </div>
                                   ) : (
                                     <button
                                       className="fp-add-btn"
                                       onClick={() => addToCart(food)}
                                     >
                                       <Plus size={11} />
                                       Add
                                     </button>
                                   )}
                                   <button
                                     className="fp-cart-remove"
                                     onClick={() => toggleFavorite(food)}
                                   >
                                     <Trash2 size={12} />
                                     Remove
                                   </button>
                                 </div>
                               </div>
                             </div>
                           )
                         })
                       )}
                     </div>
                   </div>
                    </div>
  )
}

export default FavoritesModal