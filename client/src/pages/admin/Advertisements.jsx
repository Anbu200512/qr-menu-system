import {
  useEffect,
  useState,
} from "react"

import toast from "react-hot-toast"

import {
  getAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
} from "../../services/advertisementService"

import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaImage,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa"

function Advertisements() {
  const [advertisements, setAdvertisements] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const advertisementsPerPage = 6

  // MODALS
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // FORM
const [bannerForm, setBannerForm] = useState({
  title: "",
  description: "",
  isActive: true,
  image: null,
})
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null)

  // FETCH advertisements
  const fetchadvertisements = async () => {
    try {
      const data = await getAdvertisements()
      setAdvertisements(data?.advertisements || [])
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch advertisements")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadAdvertisements = async () => {
      await fetchadvertisements()
    }

    loadAdvertisements()
  }, [])

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setBannerForm({
      ...bannerForm,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // HANDLE IMAGE
  const handleImageChange = (e) => {
    setBannerForm({
      ...bannerForm,
      image: e.target.files[0],
    })
  }

  // RESET FORM
  const resetForm = () => {
    setBannerForm({
  title: "",
  description: "",
  isActive: true,
  image: null,
})
  }

  // ADD ADVERTISEMENT
  const handleAddAdvertisement = async () => {

    console.log("FORM:", bannerForm)
    if (!bannerForm.title.trim()) {
      return toast.error("Title required")
    }
    if (!bannerForm.image) {
      return toast.error("Banner image required")
    }
    try {
      const formData = new FormData()
      Object.keys(bannerForm).forEach((key) => {
        if (bannerForm[key] !== null) {
          formData.append(key, bannerForm[key])
        }
      })

      console.log("Sending request...")

      await createAdvertisement(formData)
      toast.success("Banner added successfully")
      resetForm()
      setShowAddModal(false)
      fetchadvertisements()
    } catch (error) {
      console.log(error)
      toast.error("Add advertisement failed")
    }
  }

  // EDIT ADVERTISEMENT
  const handleEditAdvertisement = async () => {
    try {
      const formData = new FormData()
      Object.keys(bannerForm).forEach((key) => {
        if (bannerForm[key] !== null) {
          formData.append(key, bannerForm[key])
        }
      })
      await updateAdvertisement(
  selectedAdvertisement._id,
  formData
)
      toast.success("Banner updated successfully")
      setShowEditModal(false)
      fetchadvertisements()
    } catch (error) {
      console.log(error)
      toast.error("Update failed")
    }
  }

  // DELETE ADVERTISEMENT
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this advertisement?")
    if (!confirmDelete) return
    try {
      await deleteAdvertisement(id)
      toast.success("Advertisement deleted")
      fetchadvertisements()
    } catch (error) {
      console.log(error)
      toast.error("Delete failed")
    }
  }

  // FILTER
  const filteredadvertisements = (advertisements || []).filter((advertisement) =>
    advertisement.title?.toLowerCase().includes(search.toLowerCase())
  )

  // PAGINATION
  const totalPages = Math.ceil(filteredadvertisements.length / advertisementsPerPage)
  const startIndex = (currentPage - 1) * advertisementsPerPage
  const currentadvertisements = filteredadvertisements.slice(startIndex, startIndex + advertisementsPerPage)

  // LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c84b2f] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
            Loading advertisements...
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
          advertisements 
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Manage homepage promotional advertisements
        </p>
      </div>

      {/* SEARCH + ADD BAR */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search advertisements..."
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
          <FaPlus size={14} /> Add Advertisement
        </button>
      </div>

      {/* STATS BADGE */}
      <div className="mb-6 flex justify-between items-center">
        <div className="bg-[#c84b2f]/10 dark:bg-[#c84b2f]/20 text-[#c84b2f] px-4 py-2 rounded-full text-sm font-medium">
          Total: {filteredadvertisements.length} advertisements
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-900/50 px-5 py-3 border-b border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          <div className="col-span-2">Image</div>
          <div className="col-span-3">Title</div>
          <div className="col-span-4">
  Description
</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {currentadvertisements.map((banner) => (
          <div
            key={banner._id}
            className="grid grid-cols-12 items-center px-5 py-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
          >
            <div className="col-span-2">
              <img
  src={banner.image}
  alt={banner.title}
  className="w-16 h-12 rounded-lg object-cover"
/>
            </div>
            <div className="col-span-3">
              <p className="font-semibold text-gray-800 dark:text-white">{banner.title}</p>
            </div>
            <div className="col-span-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
  {banner.description}
</p>
            </div>
            
            <div className="col-span-1">
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  banner.isActive
                    ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                }`}
              >
                {banner.isActive ? <FaToggleOn size={10} /> : <FaToggleOff size={10} />}
                {banner.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedAdvertisement(banner)
                  setBannerForm({
  title: banner.title,
  description:
    banner.description,
  isActive: banner.isActive,
  image: null,
})
                  setShowEditModal(true)
                }}
                className="p-2 rounded-lg text-[#c84b2f] hover:bg-[#c84b2f]/10 transition-all"
              >
                <FaEdit size={16} />
              </button>
              <button
                onClick={() => handleDelete(banner._id)}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {currentadvertisements.map((banner) => (
          <div
            key={banner._id}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
          >
            <img
  src={banner.image}
  alt={banner.title}
  className="w-full h-36 object-cover"
/>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">{banner.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
  {banner.description}
</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setSelectedAdvertisement(banner)
                      setBannerForm({
                        title: banner.title,
                        description: banner.description,
                        isActive: banner.isActive,
                        
                        image: null,
                      })
                      setShowEditModal(true)
                    }}
                    className="p-2 rounded-lg text-[#c84b2f] hover:bg-[#c84b2f]/10"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    banner.isActive
                      ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  }`}
                >
                  {banner.isActive ? <FaToggleOn size={10} /> : <FaToggleOff size={10} />}
                  {banner.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {currentadvertisements.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
          <div className="text-6xl mb-4">🖼️</div>
          <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">
            No advertisements Found
          </h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Click "Add Advertisement" to create your first advertisement
          </p>
        </div>
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
      {showAddModal && (
        <Modal
  title="Add New Advertisement"
  onClose={() => {
    setShowAddModal(false)
    resetForm()
  }}
  onSubmit={handleAddAdvertisement}
  submitText="Add Advertisement"
>
          <BannerForm
            bannerForm={bannerForm}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <Modal
  title="Edit Advertisement"
  onClose={() => {
    setShowEditModal(false)
    resetForm()
  }}
  onSubmit={handleEditAdvertisement}
  submitText="Update Advertisement"
>
          <BannerForm
            bannerForm={bannerForm}
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

// BANNER FORM COMPONENT
function BannerForm({ bannerForm, handleChange, handleImageChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        name="title"
        placeholder="Banner Title"
        value={bannerForm.title}
        onChange={handleChange}
        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#c84b2f] transition-all text-gray-800 dark:text-white placeholder-gray-400"
      />
      <textarea
  name="description"
  placeholder="Advertisement Description"
  value={bannerForm.description}
        onChange={handleChange}
        rows="3"
        className="md:col-span-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#c84b2f] transition-all text-gray-800 dark:text-white placeholder-gray-400"
      />
      <label className="md:col-span-2 flex items-center gap-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 cursor-pointer">
        <FaImage className="text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {bannerForm.image ? bannerForm.image.name : "Choose Banner Image"}
        </span>
        <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
      </label>
      <label className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
        <input
          type="checkbox"
          name="isActive"
          checked={bannerForm.isActive}
          onChange={handleChange}
          className="w-4 h-4 accent-[#c84b2f]"
        />
        Active Banner (shown on homepage)
      </label>
    </div>
  )
}

export default Advertisements