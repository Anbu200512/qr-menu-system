import {
  useContext,
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

import toast from "react-hot-toast"

import { AuthContext } from "../../context/AuthContext"

import { login } from "../../services/authService"

import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaUtensils,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"

function Login() {
  const navigate = useNavigate()
  const { login: authLogin } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      return toast.error("Email required")
    }
    if (!password.trim()) {
      return toast.error("Password required")
    }

    setLoading(true)

    try {
      const data = await login({ email, password })
      authLogin(data)
      toast.success("Login Successful")
      navigate("/admin/dashboard")
    } catch (error) {
      console.log(error)
      toast.error("Login Failed. Check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#c84b2f]/10 via-gray-50 to-white dark:from-[#c84b2f]/20 dark:via-gray-900 dark:to-gray-900 p-4">
      
      {/* LOGIN CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* HEADER WITH RESTAURANT LOGO */}
        <div className="bg-gradient-to-r from-[#c84b2f] to-[#b03d24] px-8 py-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
            <FaUtensils className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/80 text-sm mt-1">Sign in to your admin account</p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="p-8">
          
          {/* EMAIL INPUT */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                placeholder="admin@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#c84b2f] focus:ring-1 focus:ring-[#c84b2f] transition-all text-gray-800 dark:text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* PASSWORD INPUT WITH SHOW/HIDE TOGGLE */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-12 py-3 outline-none focus:border-[#c84b2f] focus:ring-1 focus:ring-[#c84b2f] transition-all text-gray-800 dark:text-white placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c84b2f] transition-all"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c84b2f] hover:bg-[#b03d24] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                <FaSignInAlt size={16} /> Login
              </>
            )}
          </button>

          {/* DEMO CREDENTIALS HINT */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Demo Credentials
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Email: admin@example.com
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login