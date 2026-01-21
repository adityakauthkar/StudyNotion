import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"

const {
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

// ================== SIGNUP ==================
export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  phoneNumber,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phoneNumber,
      })

      console.log("SIGNUP API RESPONSE:", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Signup Successful")
      navigate("/login")

    } catch (error) {
      console.log("SIGNUP API ERROR:", error)
      toast.error(error.response?.data?.message || "Signup Failed")
    }

    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

// ================== LOGIN ==================
export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE:", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      const user = response.data.user
      const token = response.data.token

      const userImage = user.image
        ? user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
            user.firstName
          )}+${encodeURIComponent(user.lastName)}`

      dispatch(setToken(token))
      dispatch(setUser({ ...user, image: userImage }))

      localStorage.setItem("token", JSON.stringify(token))
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, image: userImage })
      )

      toast.success("Login Successful")
      navigate("/dashboard/my-profile")

    } catch (error) {
      console.log("LOGIN API ERROR:", error)
      toast.error(error.response?.data?.message || "Login Failed")
    }

    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

// ================== SEND RESET PASSWORD TOKEN ==================
export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, { email })

      console.log("RESET TOKEN RESPONSE:", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Reset Email Sent")
      setEmailSent(true)

    } catch (error) {
      console.log("RESET TOKEN ERROR:", error)
      toast.error(error.response?.data?.message || "Failed to send reset email")
    }

    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

// ================== RESET PASSWORD ==================
export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      console.log("RESET PASSWORD RESPONSE:", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successful")
      navigate("/login")

    } catch (error) {
      console.log("RESET PASSWORD ERROR:", error)
      toast.error(error.response?.data?.message || "Failed to reset password")
    }

    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

// ================== LOGOUT ==================
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    toast.success("Logged Out")
    navigate("/")
  }
}
