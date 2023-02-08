import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import { useEffect } from "react"
import { useUser } from "../context/user"
import { ActionType } from "../context/userReducer"
import { auth } from "./config"
import { findCurrentUser } from "./firestore/user"

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

export const logout = () => {
  if (window.confirm("Are you Sure?")) {
    signOut(auth)
  }
}

export const useOnAuthChange = () => {
  const { dispatch } = useUser()

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch({ type: ActionType.SetLogin, payload: true })
        const storeUser = await findCurrentUser(user)

        if (storeUser)
          dispatch({ type: ActionType.FoundUser, payload: storeUser })
        else dispatch({ type: ActionType.SetUsernameDialog, payload: true })
      } else dispatch({ type: ActionType.SetLogin, payload: false })
    })
  }, [])
}
