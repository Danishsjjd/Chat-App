import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
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
export const findFriend = async (
  friendUsername: string,
  user: StoreUser
): Promise<boolean> => {
  const err = "user is not exists"
  if (friendUsername == user.username) {
    toast.error(err)
    return false
  }
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
  if (data.docs.length <= 0) {
    toast.error(err)
    return false
  }

  const chatBetweenRef = collection(
    db,
    "chatBetween"
  ) as CollectionReference<ChatBetween>

  const [friendData] = data.docs.map((doc) => {
    return doc.data()
  })

  const q = query(
    chatBetweenRef,
    where("users", "array-contains-any", [user.uid, friendData.uid])
  )

  const isExists = await getDocs(q)

  const check = isExists.docs.map((data) => data.data())

  for (const key of check) {
    if (key.users.includes(friendData.uid) && key.users.includes(user.uid)) {
      toast.error("chat is already exists")
      return false
    }
  }

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
    return true
  }
  return false
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
  const q = query(
    chatBetweenRef,
    where("users", "array-contains", user.uid),
    orderBy("createdAt", "desc")
  )

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
            createdAt: key.createAt || new Date().getTime(),
          })
      })
    }
  })

  return unsub
}

// TODO: individual route onSnapshot chats collection
