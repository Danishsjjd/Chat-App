import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore"
import toast from "react-hot-toast"
import { ChatBetween, ChatRelatedUsers, ChatUser } from "../../types/chat"
import { StoreUser } from "../../types/user"
import { db } from "../config"

// TODO: see below comments
export const findFriend = async (friendUsername: string, user: StoreUser) => {
  const collectionRef = collection(
    db,
    "users"
  ) as CollectionReference<StoreUser>
  const queryRef = query(
    collectionRef,
    where("username", "==", friendUsername),
    limit(1)
  )
  const data = await getDocs(queryRef)
  if (data.docs.length <= 0) return toast.error("user is not exists")

  const chatBetweenRef = collection(db, "chatBetween")

  const [friendData] = data.docs.map((doc) => {
    return doc.data()
  })

  const docId = crypto.randomUUID()

  const docRef = doc(chatBetweenRef, docId) as DocumentReference<ChatBetween>
  const nestedDocRef = () =>
    doc(
      docRef,
      "chatRelatedUser",
      crypto.randomUUID()
    ) as DocumentReference<ChatUser>

  if (friendData) {
    const batch = writeBatch(db)

    batch.set(docRef, {
      latestMessage: "",
      users: [friendData.uid, user.uid],
      createdAt: serverTimestamp(),
    })

    batch.set(nestedDocRef(), {
      photoURL: friendData.photoURL,
      username: friendData.username,
      isReadLatestMsg: false,
    })
    batch.set(nestedDocRef(), {
      photoURL: user.photoURL,
      username: user.username,
      isReadLatestMsg: true,
    })

    await batch.commit()
  }
}

// TODO: will use in side bar
export const getAllCurrentUserChats = async (
  user: StoreUser,
  cb?: (users: ChatRelatedUsers) => void
) => {
  const chatBetweenRef = collection(
    db,
    "chatBetween"
  ) as CollectionReference<ChatBetween>
  const q = query(chatBetweenRef, where("users", "array-contains", user.uid))

  const unsub = onSnapshot(q, async (data) => {
    const chatBetween = data.docs.map((collectionBetweenInstance) => {
      const chatData = collectionBetweenInstance.data()
      return {
        id: collectionBetweenInstance.id,
        latestMessage: chatData.latestMessage,
        createAt: chatData.createdAt,
      }
    })

    for (const key of chatBetween) {
      const chatRelatedUserRef = collection(
        db,
        "chatBetween",
        key.id,
        "chatRelatedUser"
      ) as CollectionReference<ChatUser>
      const chatRelated = await getDocs(chatRelatedUserRef)

      chatRelated.docs.forEach((doc) => {
        const chatRelatedDoc = doc.data()
        if (cb)
          cb({
            ...chatRelatedDoc,
            chatId: key.id,
            lastMsg: key.latestMessage,
            createdAt: key.createAt,
          })
      })
    }
  })

  return unsub
}

// TODO: individual route onSnapshot chats collection
