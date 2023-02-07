import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth"
import { useEffect } from "react"
import { useUser } from "../context/user"
import { ActionType } from "../context/userReducer"
import { auth } from "./config"
import { findCurrentUser } from "./firestore"

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

export const useOnAuthChange = () => {
  const { dispatch } = useUser()

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch({ type: ActionType.YesLogin, payload: undefined })
        const storeUser = await findCurrentUser(user)

        if (storeUser)
          dispatch({ type: ActionType.SetUser, payload: storeUser })
        else dispatch({ type: ActionType.SetUsernameDialog, payload: true })

        return
      }
      dispatch({ type: ActionType.NotLogin, payload: undefined })
    })
  }, [])
}
