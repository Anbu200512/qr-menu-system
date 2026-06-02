function CategoryTabs({
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="flex gap-3 overflow-x-auto mb-6">
      <button
        onClick={() => setSelectedCategory("All")}
        className={`px-4 py-2 rounded-full ${
          selectedCategory === "All"
            ? "bg-green-600 text-white"
            : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() =>
            setSelectedCategory(category.name)
          }
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            selectedCategory === category.name
              ? "bg-green-600 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryTabs