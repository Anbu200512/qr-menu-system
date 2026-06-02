import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {
  const userInfo = localStorage.getItem("userInfo")

  if (!userInfo) {
    return <Navigate to="/admin/login" replace />
  }

  try {
    const user = JSON.parse(userInfo)

    if (!user?.token) {
      return <Navigate to="/admin/login" replace />
    }

    return children
  } catch {
    localStorage.removeItem("userInfo")
    return <Navigate to="/admin/login" replace />
  }
}

export default ProtectedRoute