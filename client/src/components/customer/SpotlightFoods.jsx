import FoodCard from "./FoodCard"

function SpotlightFoods({
  foods,
}) {
  const popularFoods = foods.filter(
    (food) => food.isPopular
  )

  if (popularFoods.length === 0)
    return null

  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold mb-6">
        🔥 In The Spotlight
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularFoods.map((food) => (
          <FoodCard
            key={food._id}
            food={food}
          />
        ))}
      </div>
    </div>
  )
}

export default SpotlightFoods