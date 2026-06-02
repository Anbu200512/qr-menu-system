import { Outlet } from "react-router-dom"

function CustomerLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-all">

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default CustomerLayout