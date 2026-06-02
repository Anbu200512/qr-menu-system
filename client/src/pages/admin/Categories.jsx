import {
  useEffect,
  useState,
} from "react"

import toast from "react-hot-toast"

import {
  getCategories,
  deleteCategory,
  createCategory,
  updateCategory,
} from "../../services/categoryService"

import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaUtensils,
} from "react-icons/fa"

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [categoryName, setCategoryName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editCategoryName, setEditCategoryName] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const categoriesPerPage = 8

  // FETCH
  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data?.categories || [])
    } catch (error) {
      toast.error("Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // ADD
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      return toast.error("Category name required")
    }
    try {
      await createCategory({ name: categoryName })
      toast.success("Category added successfully")
      setCategoryName("")
      setShowModal(false)
      fetchCategories()
    } catch (error) {
  console.log("CATEGORY ERROR:", error)
  console.log("RESPONSE:", error.response)
  console.log("DATA:", error.response?.data)

  toast.error("Failed to add category")
}
  }

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this category?")
    if (!confirmDelete) return
    try {
      await deleteCategory(id)
      toast.success("Category deleted successfully")
      fetchCategories()
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  // EDIT
  const handleEditCategory = async () => {
    if (!editCategoryName.trim()) {
      return toast.error("Category name required")
    }
    try {
      await updateCategory(selectedCategory._id, {
        name: editCategoryName,
      })
      toast.success("Category updated successfully")
      setEditModal(false)
      setEditCategoryName("")
      setSelectedCategory(null)
      fetchCategories()
    } catch (error) {
      toast.error("Update failed")
    }
  }

  // FILTER
  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(search.toLowerCase())
  )

  // PAGINATION
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage)
  const startIndex = (currentPage - 1) * categoriesPerPage
  const currentCategories = filteredCategories.slice(startIndex, startIndex + categoriesPerPage)

  // LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c84b2f] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
            Loading Categories...
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
          Categories 
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Manage your restaurant categories
        </p>
      </div>

      {/* SEARCH + ADD BAR */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* SEARCH */}
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#c84b2f] dark:focus:border-[#c84b2f] transition-all text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#c84b2f] hover:bg-[#b03d24] text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm whitespace-nowrap"
        >
          <FaPlus size={14} /> Add Category
        </button>
      </div>

      {/* STATS BADGE */}
      <div className="mb-6 flex justify-between items-center">
        <div className="bg-[#c84b2f]/10 dark:bg-[#c84b2f]/20 text-[#c84b2f] dark:text-[#c84b2f] px-4 py-2 rounded-full text-sm font-medium">
          Total: {filteredCategories.length} categories
        </div>
      </div>

      {/* EMPTY STATE */}
      {currentCategories.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 md:p-20 text-center border border-gray-100 dark:border-gray-700">
          <div className="text-6xl mb-4">📂</div>
          <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">
            No Categories Found
          </h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Click "Add Category" to create your first category
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-900/50 px-5 py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="col-span-6 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Category Name
              </div>
              <div className="col-span-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Total Foods
              </div>
              <div className="col-span-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">
                Actions
              </div>
            </div>

            {currentCategories.map((category) => (
              <div
                key={category._id}
                className="grid grid-cols-12 items-center px-5 py-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
              >
                <div className="col-span-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {category.name}
                  </h3>
                </div>
                <div className="col-span-3">
                  <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <FaUtensils size={12} /> {category.foodsCount || 0} Foods
                  </span>
                </div>
                <div className="col-span-3 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditModal(true)
                      setSelectedCategory(category)
                      setEditCategoryName(category.name)
                    }}
                    className="p-2 rounded-lg text-[#c84b2f] hover:bg-[#c84b2f]/10 transition-all"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {currentCategories.map((category) => (
              <div
                key={category._id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    {category.name}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditModal(true)
                        setSelectedCategory(category)
                        setEditCategoryName(category.name)
                      }}
                      className="p-2 rounded-lg text-[#c84b2f] hover:bg-[#c84b2f]/10 transition-all"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FaUtensils size={12} />
                  <span>{category.foodsCount || 0} Foods</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Add Category
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#c84b2f] transition-all text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 mb-5"
            />

            <div className="flex gap-3">
              <button
                onClick={handleAddCategory}
                className="flex-1 bg-[#c84b2f] hover:bg-[#b03d24] text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <FaCheck size={14} /> Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Edit Category
              </h2>
              <button
                onClick={() => setEditModal(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Category name"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleEditCategory()}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#c84b2f] transition-all text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 mb-5"
            />

            <div className="flex gap-3">
              <button
                onClick={handleEditCategory}
                className="flex-1 bg-[#c84b2f] hover:bg-[#b03d24] text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <FaCheck size={14} /> Update
              </button>
              <button
                onClick={() => setEditModal(false)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories