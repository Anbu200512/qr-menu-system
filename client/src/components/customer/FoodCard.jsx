import {
  useContext,
} from "react"

import {
  FaLeaf,
  FaDrumstickBite,
  FaFire,
  FaShoppingCart,
} from "react-icons/fa"

import { CartContext } from "../../context/CartContext"

function FoodCard({ food }) {
  const { addToCart } =
    useContext(CartContext)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      {/* Image Section */}
      <div className="relative">
        <img
          src={` ${import.meta.env.VITE_API_URL}${food.image}`}
          alt={food.name}
          className="w-full h-56 object-cover"
        />

        {/* Veg / Non-Veg Badge */}
        <div className="absolute top-4 left-4">
          {food.isVeg ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm shadow-md">
              <FaLeaf />

              Veg
            </span>
          ) : (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm shadow-md">
              <FaDrumstickBite />

              Non Veg
            </span>
          )}
        </div>

        {/* Popular Badge */}
        {food.isPopular && (
          <div className="absolute top-4 right-4">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm shadow-md">
              <FaFire />

              Popular
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title + Category */}
        <div className="flex justify-between items-start gap-3">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {food.name}
          </h2>

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm whitespace-nowrap">
            {food.category?.name}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-300 mt-3 line-clamp-2 leading-relaxed">
          {food.description}
        </p>

        {/* Bottom */}
        <div className="mt-6 flex justify-between items-center">
          {/* Price */}
          <span className="text-3xl font-bold text-green-600">
            ₹{food.price}
          </span>

          {/* Add to Cart */}
          <button
            onClick={() => addToCart(food)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl transition-all flex items-center gap-2 shadow-md hover:scale-105"
          >
            <FaShoppingCart />

            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default FoodCard