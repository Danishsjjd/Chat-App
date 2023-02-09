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
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore"
import toast from "react-hot-toast"
import { Chat, ChatBetween, ChatRelatedUsers, ChatUser } from "../../types/chat"
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
  const nestedDocRef = (userId: string) =>
    doc(docRef, "chatRelatedUser", userId) as DocumentReference<ChatUser>

  if (friendData) {
    const batch = writeBatch(db)

    batch.set(docRef, {
      latestMessage: "",
      users: [friendData.uid, user.uid],
      createdAt: serverTimestamp(),
    })

    batch.set(nestedDocRef(friendData.uid), {
      photoURL: friendData.photoURL,
      username: friendData.username,
      isReadLatestMsg: false,
    })
    batch.set(nestedDocRef(user.uid), {
      photoURL: user.photoURL,
      username: user.username,
      isReadLatestMsg: true,
    })

    await batch.commit()
    return true
  }
  return false
}

// TODO: Add loader
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
      const chatUserRef = collection(
        db,
        "chatBetween",
        key.id,
        "chatRelatedUser"
      ) as CollectionReference<ChatUser>
      const chatRelated = await getDocs(chatUserRef)

      chatRelated.docs.forEach((doc) => {
        const chatRelatedDoc = doc.data()
        if (cb)
          cb({
            ...chatRelatedDoc,
            chatId: key.id,
            latestMessage: key.latestMessage,
            createdAt: key.createAt || new Date().getTime(),
          })
      })
    }
  })

  return unsub
}

type Props = {
  chatId: string
  user: StoreUser
  message: string
  cb?: () => void
}

// TODO: handle errors
export const sendMessage = async ({ chatId, user, message, cb }: Props) => {
  const chatRef = doc(
    db,
    "chat",
    chatId,
    "messages",
    crypto.randomUUID()
  ) as DocumentReference<Chat>

  const batch = writeBatch(db)

  batch.set(chatRef, {
    id: crypto.randomUUID(),
    message,
    username: user.username,
    createAt: Timestamp.now(),
  })

  const chatRelatedUserRef = doc(
    db,
    "chatBetween",
    chatId
  ) as DocumentReference<ChatBetween>

  batch.update(chatRelatedUserRef, {
    createdAt: serverTimestamp(),
    latestMessage: message,
  })

  const userChatBetweenRef = doc(
    db,
    "chatBetween",
    chatId,
    "chatRelatedUser",
    user.uid
  ) as DocumentReference<ChatUser>

  batch.update(userChatBetweenRef, { isReadLatestMsg: true })

  await batch.commit()
  // TODO: handle errors
  if (cb) cb()
}

// TODO: individual route onSnapshot chats collection
export const messagesListener = async (
  chatId: string,
  cb?: (chat: Chat[]) => void
) => {
  const chatRef = collection(
    db,
    "chat",
    chatId,
    "messages"
  ) as CollectionReference<Chat>
  const q = query(chatRef, orderBy("createAt", "asc"))
  return onSnapshot(q, (doc) => {
    const data = doc.docs.map((msg) => msg.data())
    if (cb) cb(data)
  })
}
