import {
  useEffect,
  useState,
} from "react"

import toast from "react-hot-toast"

import {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
} from "../../services/foodService"

import {
  getCategories,
} from "../../services/categoryService"

import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaUtensils,
  FaFire,
  FaLeaf,
  FaImage,
  FaRupeeSign,
} from "react-icons/fa"

function Foods() {
  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // SEARCH
  const [search, setSearch] = useState("")

  // FILTERS
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [vegFilter, setVegFilter] = useState("all")

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1)
  const foodsPerPage = 8

  // MODALS
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // FORM
  const [foodForm, setFoodForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isVeg: true,
    isPopular: false,
    image: null,
  })

  const [selectedFood, setSelectedFood] = useState(null)

  // FETCH DATA
  const fetchData = async () => {
    try {
      const foodData = await getFoods()
      const categoryData = await getCategories()
      setFoods(foodData?.foods || [])
setCategories(categoryData?.categories || [])
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch foods")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFoodForm({
      ...foodForm,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // HANDLE IMAGE
  const handleImageChange = (e) => {
    setFoodForm({
      ...foodForm,
      image: e.target.files[0],
    })
  }

  // RESET FORM
  const resetForm = () => {
    setFoodForm({
      name: "",
      description: "",
      price: "",
      category: "",
      isVeg: true,
      isPopular: false,
      image: null,
    })
  }

  // ADD FOOD
  const handleAddFood = async () => {
    if (!foodForm.name.trim()) {
      return toast.error("Food name required")
    }
    if (!foodForm.price) {
      return toast.error("Price required")
    }
    if (!foodForm.category) {
      return toast.error("Category required")
    }
    try {
      const formData = new FormData()
      Object.keys(foodForm).forEach((key) => {
        if (foodForm[key] !== null) {
          formData.append(key, foodForm[key])
        }
      })
      await createFood(formData)
      toast.success("Food added successfully")
      setShowAddModal(false)
      resetForm()
      fetchData()
    } 
    catch (error) {
  console.log("FULL ERROR:", error)
  console.log("RESPONSE:", error.response)
  console.log("DATA:", error.response?.data)

  alert(
    error.response?.data?.message ||
    "Failed to add food"
  )
}
  }

  // EDIT FOOD
  const handleEditFood = async () => {
    try {
      const formData = new FormData()
      Object.keys(foodForm).forEach((key) => {
        if (foodForm[key] !== null) {
          formData.append(key, foodForm[key])
        }
      })
      await updateFood(selectedFood._id, formData)
      toast.success("Food updated successfully")
      setShowEditModal(false)
      fetchData()
    } catch (error) {
      console.log(error)
      toast.error("Update failed")
    }
  }

  // DELETE FOOD
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this food?")
    if (!confirmDelete) return
    try {
      await deleteFood(id)
      toast.success("Food deleted")
      fetchData()
    } catch (error) {
      console.log(error)
      toast.error("Delete failed")
    }
  }

  // FILTER FOODS
  const filteredFoods = (foods || []).filter((food) => {
    const matchesSearch = food.name?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" ? true : food.category?.name === categoryFilter
    const matchesVeg =
      vegFilter === "all" ? true : vegFilter === "veg" ? food.isVeg : !food.isVeg
    return matchesSearch && matchesCategory && matchesVeg
  })

  // PAGINATION
  const totalPages = Math.ceil(filteredFoods.length / foodsPerPage)
  const startIndex = (currentPage - 1) * foodsPerPage
  const currentFoods = filteredFoods.slice(startIndex, startIndex + foodsPerPage)

  // LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c84b2f] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
            Loading Foods...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-0 md:px-2">
      {/* HEADER */}
      <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Menu Items 
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Manage your restaurant's food menu
        </p>
      </div>

      {/* SEARCH + ADD BAR */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search foods..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#c84b2f] transition-all text-gray-800 dark:text-white placeholder-gray-400"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#c84b2f] hover:bg-[#b03d24] text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm whitespace-nowrap"
        >
          <FaPlus size={14} /> Add Food
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
          Total: {filteredFoods.length} items
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#c84b2f] text-gray-700 dark:text-gray-300"
        >
          <option value="all">All Categories</option>
          {(categories || []).map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={vegFilter}
          onChange={(e) => {
            setVegFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#c84b2f] text-gray-700 dark:text-gray-300"
        >
          <option value="all">All Types</option>
          <option value="veg"> Veg</option>
          <option value="nonveg"> Non Veg</option>
        </select>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden xl:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-900/50 px-5 py-3 border-b border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          <div className="col-span-2">Image</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1">Price</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Popular</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {currentFoods.map((food) => (
          <div
            key={food._id}
            className="grid grid-cols-12 items-center px-5 py-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
          >
            <div className="col-span-2">
              <img
  src={food.image}
  alt={food.name}
  className="w-12 h-12 rounded-xl object-cover"
/>
            </div>
            <div className="col-span-3">
              <p className="font-semibold text-gray-800 dark:text-white">{food.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{food.description?.slice(0, 40)}</p>
            </div>
            <div className="col-span-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{food.category?.name}</span>
            </div>
            <div className="col-span-1">
              <span className="font-semibold text-[#c84b2f]">₹{food.price}</span>
            </div>
            <div className="col-span-1">
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  food.isVeg
                    ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                }`}
              >
                <FaLeaf size={10} />
                {food.isVeg ? "Veg" : "Non Veg"}
              </span>
            </div>
            <div className="col-span-1">
              {food.isPopular && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-[#c84b2f]/10 dark:bg-[#c84b2f]/20 text-[#c84b2f]">
                  <FaFire size={10} /> Popular
                </span>
              )}
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedFood(food)
                  setFoodForm({
                    name: food.name,
                    description: food.description,
                    price: food.price,
                    category: food.category?._id,
                    isVeg: food.isVeg,
                    isPopular: food.isPopular,
                    image: null,
                  })
                  setShowEditModal(true)
                }}
                className="p-2 rounded-lg text-[#c84b2f] hover:bg-[#c84b2f]/10 transition-all"
              >
                <FaEdit size={16} />
              </button>
              <button
                onClick={() => handleDelete(food._id)}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:hidden">
        {currentFoods.map((food) => (
          <div
            key={food._id}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
          >
            <img
  src={food.image}
  alt={food.name}
  className="w-12 h-12 rounded-xl object-cover"
/>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{food.name}</h3>
                <span className="font-bold text-[#c84b2f]">₹{food.price}</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{food.category?.name}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    food.isVeg
                      ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  }`}
                >
                  <FaLeaf size={10} />
                  {food.isVeg ? "Veg" : "Non Veg"}
                </span>
                {food.isPopular && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-[#c84b2f]/10 text-[#c84b2f]">
                    <FaFire size={10} /> Popular
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedFood(food)
                    setFoodForm({
                      name: food.name,
                      description: food.description,
                      price: food.price,
                      category: food.category?._id,
                      isVeg: food.isVeg,
                      isPopular: food.isPopular,
                      image: null,
                    })
                    setShowEditModal(true)
                  }}
                  className="flex-1 bg-[#c84b2f]/10 text-[#c84b2f] py-2 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
                >
                  <FaEdit size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(food._id)}
                  className="flex-1 bg-red-500/10 text-red-500 py-2 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
                >
                  <FaTrash size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#c84b2f] transition-all text-sm font-medium"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${
                currentPage === index + 1
                  ? "bg-[#c84b2f] text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#c84b2f]"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#c84b2f] transition-all text-sm font-medium"
          >
            Next
          </button>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <Modal
          title="Add New Food"
          onClose={() => {
            setShowAddModal(false)
            resetForm()
          }}
          onSubmit={handleAddFood}
          submitText="Add Food"
        >
          <FoodForm
            foodForm={foodForm}
            categories={categories}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <Modal
          title="Edit Food"
          onClose={() => {
            setShowEditModal(false)
            resetForm()
          }}
          onSubmit={handleEditFood}
          submitText="Update Food"
        >
          <FoodForm
            foodForm={foodForm}
            categories={categories}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
          />
        </Modal>
      )}
    </div>
  )
}

// MODAL COMPONENT
function Modal({ title, onClose, onSubmit, submitText, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <FaTimes size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-6 py-4 flex gap-3">
          <button
            onClick={onSubmit}
            className="flex-1 bg-[#c84b2f] hover:bg-[#b03d24] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <FaCheck size={14} /> {submitText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-semibold transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// FOOD FORM COMPONENT
function FoodForm({ foodForm, categories, handleChange, handleImageChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        name="name"
        placeholder="Food Name"
        value={foodForm.name}
        onChange={handleChange}
        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#c84b2f] transition-all text-gray-800 dark:text-white placeholder-gray-400"
      />
      <div className="relative">
        <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={foodForm.price}
          onChange={handleChange}
          className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#c84b2f] transition-all text-gray-800 dark:text-white placeholder-gray-400"
        />
      </div>
      <select
        name="category"
        value={foodForm.category}
        onChange={handleChange}
        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#c84b2f] transition-all text-gray-800 dark:text-white"
      >
        <option value="">Select Category</option>
        {(categories || []).map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 cursor-pointer">
        <FaImage className="text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Choose Image</span>
        <input type="file" onChange={handleImageChange} className="hidden" />
      </label>
      <textarea
        name="description"
        placeholder="Description"
        value={foodForm.description}
        onChange={handleChange}
        rows="3"
        className="md:col-span-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#c84b2f] transition-all text-gray-800 dark:text-white placeholder-gray-400"
      />
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input type="checkbox" name="isVeg" checked={foodForm.isVeg} onChange={handleChange} className="w-4 h-4 accent-[#c84b2f]" />
          Veg
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input type="checkbox" name="isPopular" checked={foodForm.isPopular} onChange={handleChange} className="w-4 h-4 accent-[#c84b2f]" />
          Popular
        </label>
      </div>
    </div>
  )
}

export default Foods