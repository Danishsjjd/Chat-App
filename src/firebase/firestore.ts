import { User } from "firebase/auth"
import {
  addDoc,
  getDoc,
  setDoc,
  doc,
  writeBatch,
  DocumentData,
  DocumentReference,
} from "firebase/firestore"
import { StoreUser } from "../types/user"
import { store } from "./config"

export const findCurrentUser = async (user: User) => {
  const userDoc = doc(store, "users", user.uid) as DocumentReference<StoreUser>
  try {
    const username = await getDoc(userDoc)
    if (username.exists()) return username.data()
    return false
  } catch (e) {
    return false
  }
}

export const createCurrentUsername = async (
  user: User,
  username: string,
  onSuccess?: () => void
) => {
  const batch = writeBatch(store)

  const userDoc = doc(store, "users", user.uid)
  const usernameDoc = doc(store, "username", username)

  try {
    batch.set(userDoc, {
      username: username,
      photoURL: user.photoURL,
      displayName: user.displayName,
      uid: user.uid,
    })

    batch.set(usernameDoc, { uid: user.uid })

    await batch.commit()
    if (onSuccess) onSuccess()
  } catch (e) {
    // TODO:
  }
}
