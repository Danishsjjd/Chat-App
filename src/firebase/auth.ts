import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "./config"

export const authorize = async () => {
  const googleProvider = new GoogleAuthProvider()
  try {
    await signInWithPopup(auth, googleProvider)
    localStorage.setItem("isLogin", "true")
  } catch (e) {
    // TODO:
    // add toast
    localStorage.removeItem("isLogin")
  }
}
