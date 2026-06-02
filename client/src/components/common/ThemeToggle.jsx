import { useContext } from "react"

import { ThemeContext } from "../../context/ThemeContext"

function ThemeToggle() {
  const { theme, toggleTheme } =
    useContext(ThemeContext)

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg bg-green-600 text-white"
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  )
}

export default ThemeToggle