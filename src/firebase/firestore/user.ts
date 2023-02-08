import { User } from "firebase/auth"
import { doc, DocumentReference, getDoc, writeBatch } from "firebase/firestore"
import { toast } from "react-hot-toast"
import { StoreUser } from "../../types/user"
import { db } from "../config"

// user
export const findCurrentUser = async (
  user: User
): Promise<null | StoreUser> => {
  const userDoc = doc(db, "users", user.uid) as DocumentReference<StoreUser>
  try {
    const username = await getDoc(userDoc)
    if (username.exists()) return username.data()
    return null
  } catch (e) {
    return null
  }
}

export const createCurrentUsername = async (
  user: User,
  username: string,
  onSuccess?: (user: StoreUser) => void
) => {
  const batch = writeBatch(db)

  const userDoc = doc(db, "users", user.uid)
  const usernameDoc = doc(db, "username", username)

  const getUsername = await getDoc(usernameDoc)
  if (getUsername.exists())
    return toast.error("Username is already exists", { position: "top-right" })

  const userObj: StoreUser = {
    username: username.toLowerCase(),
    photoURL: user.photoURL as string,
    uid: user.uid,
  }

  try {
    batch.set(userDoc, userObj)

    batch.set(usernameDoc, { uid: user.uid })

    await batch.commit()
    if (onSuccess) onSuccess(userObj)
  } catch (e) {
    // TODO:
  }
}
