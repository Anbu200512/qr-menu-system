import { useEffect } from "react";
import { ChefHat, Star } from "lucide-react";

function ChefSpecial({
  todaySpecials = [],
  currentSpecialIndex,
  setCurrentSpecialIndex,
  addToCart,
}) {
  // Infinite Auto-Loop Timer
  useEffect(() => {
    if (!todaySpecials.length) return;
    const interval = setInterval(() => {
      setCurrentSpecialIndex((prev) => (prev + 1) % todaySpecials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [todaySpecials.length, setCurrentSpecialIndex]);

  if (!todaySpecials.length) return null;

  // Safe array processing for the infinite 3D effect
  const displaySpecials =
    todaySpecials.length === 1
      ? [todaySpecials[0], todaySpecials[0], todaySpecials[0]]
      : todaySpecials.length === 2
        ? [...todaySpecials, ...todaySpecials]
        : todaySpecials;

  return (
    <div className="w-full flex flex-col items-center py-8 px-4 overflow-hidden select-none bg-gray-50/50">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="flex items-center gap-2">
          <ChefHat size={22} className="text-[#c9964a]" />
          <h2 className="text-2xl md:text-3xl font-extrabold m-0 text-gray-900 tracking-tight">
            Chef's Special
          </h2>
        </div>
        <div className="w-12 h-1 bg-[#c9964a] rounded-full"></div>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full max-w-3xl h-[230px] md:h-[340px] flex items-center justify-center perspective-[1200px]">
        {displaySpecials.map((special, index) => {
          const total = displaySpecials.length;

          let diff = (index - currentSpecialIndex + total) % total;
          if (diff > Math.floor(total / 2)) diff -= total;

          let positionClasses =
            "opacity-0 pointer-events-none scale-75 z-0 translate-x-0";

          if (diff === 0) {
            // Center (Active)
            positionClasses =
              "z-30 scale-100 opacity-100 shadow-2xl translate-x-0 pointer-events-auto";
          } else if (diff === 1 || diff === -(total - 1)) {
            // Right
            positionClasses =
              "z-20 scale-[0.85] opacity-90 shadow-lg translate-x-[55%] md:translate-x-[70%] cursor-pointer pointer-events-auto";
          } else if (diff === -1 || diff === total - 1) {
            // Left
            positionClasses =
              "z-20 scale-[0.85] opacity-90 shadow-lg -translate-x-[55%] md:-translate-x-[70%] cursor-pointer pointer-events-auto";
          }

          return (
            <div
              key={index}
              onClick={() => setCurrentSpecialIndex(index)}
              className={`absolute transform-gpu transition-all duration-500 ease-out
  w-[210px] md:w-[300px]
  h-[200px] md:h-[300px]
  bg-white rounded-2xl group
  ${positionClasses}`}
            >
              {/* Card Wrapper */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden ring-1 ring-black/5">
                {/* Image */}
                <img
                  src={special.image}
                  alt={special.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30" />

                {/* Content */}
                {/* Top Section */}
                <div className="absolute top-4 left-4 right-4 flex gap-2">
                  <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg font-semibold">
                    <Star
                      size={10}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    {special.rating || 4.5}
                  </span>

                  <span className="bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg font-medium">
                    {special.isVeg ? "Veg" : "Non-Veg"}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg md:text-xl font-bold mb-4 text-white">
                    {special.name}
                  </h3>

                  <div className="flex justify-between items-center border-t border-white/20 pt-5 mt-2">
                    <span className="text-xl font-extrabold text-yellow-400">
                      ₹{special.price}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(special);
                      }}
                      disabled={diff !== 0}
                      className={`absolute  right-4 w-14 h-6 flex items-center justify-center gap-1 rounded-full text-sm font-semibold transition-all duration-300 ${
                        diff === 0
                          ? "bg-white text-gray-900 shadow-lg hover:scale-105 hover:bg-gray-100"
                          : "bg-white/20 backdrop-blur-md text-white/80 border border-white/20 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-base">+</span>
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Section */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Dots - Added slightly more spacing from the carousel */}
      <div className="flex gap-2 mt-8">
        {todaySpecials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSpecialIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSpecialIndex
                ? "w-8 bg-[#c9964a]"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ChefSpecial;
