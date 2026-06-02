import { FaSearch } from "react-icons/fa"

function SearchBar({
  search,
  setSearch,
}) {
  return (
    <div className="relative w-full">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        placeholder="Search delicious foods..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full bg-white border border-gray-200 p-4 pl-12 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  )
}

export default SearchBar