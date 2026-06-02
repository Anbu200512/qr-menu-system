import ThemeToggle from "./ThemeToggle"

function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-green-600">
        QR Menu
      </h1>

      <ThemeToggle />
    </nav>
  )
}

export default Navbar