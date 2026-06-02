import {
  createContext,
  useEffect,
  useState,
} from "react"

export const AuthContext =
  createContext()

function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null)

  useEffect(() => {
    const storedUser =
      localStorage.getItem(
        "userInfo"
      )

    if (
      storedUser &&
      storedUser !==
        "undefined"
    ) {
      setUser(
        JSON.parse(storedUser)
      )
    }
  }, [])

  // LOGIN
  const login = (userData) => {
    localStorage.setItem(
      "userInfo",
      JSON.stringify(userData)
    )

    setUser(userData)
  }

  // LOGOUT
  const logout = () => {
  localStorage.removeItem("userInfo")
  setUser(null)

  window.location.replace("/admin/login")
}

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider