import {
  collection,
  CollectionReference,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore"
import toast from "react-hot-toast"
import { StoreUser } from "../../types/user"
import { db } from "../config"

// TODO: see below comments
export const findFriend = async (firendUsername: string, user: StoreUser) => {
  const collectionRef = collection(
    db,
    "users"
  ) as CollectionReference<StoreUser>
  const queryRef = query(
    collectionRef,
    where("username", "==", firendUsername),
    limit(1)
  )
  const data = await getDocs(queryRef)
  if (data.docs.length <= 0) return toast.error("user is not exists")

  const chatBetweenRef = collection(db, "chatBetween")

  const [friendData] = data.docs.map((doc) => {
    return doc.data()
  })

  const docId = crypto.randomUUID()

  const docRef = doc(chatBetweenRef, docId)
  const nestedDocRef = doc(docRef, "chatRelatedUser", crypto.randomUUID())
  const secondDocRef = doc(docRef, "chatRelatedUser", crypto.randomUUID())

  if (friendData) {
    // use batch instead of these await statements
    await setDoc(docRef, {
      latestMessage: "", // ! set message text here
      users: [friendData.uid, user.uid],
    })
    await setDoc(nestedDocRef, {
      photoURL: friendData.photoURL,
      username: friendData.username,
      isReadLatestMsg: false,
    })
    await setDoc(secondDocRef, {
      photoURL: user.photoURL,
      username: user.username,
      isReadLatestMsg: true,
    })
  }
}

// TODO: will use in side bar
export const getAllCurrentUserChats = async (user: StoreUser) => {
  const chatBetweenRef = collection(db, "chatBetween")
  const q = query(chatBetweenRef, where("users", "array-contains", user.uid))

  const data = await getDocs(q)
  console.log("check ref", data.docs.length)
  data.docs.map((doc) => {
    console.log("check", doc.data())
  })
}

// TODO: individual route onSnapshot chats collection
