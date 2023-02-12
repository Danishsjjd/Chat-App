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
import {
  Chat,
  ChatBetween,
  ChatCallback,
  ChatRelatedUsers,
  ChatUser,
} from "../../types/chat"
import { StoreUser } from "../../types/user"
import { db } from "../config"

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

// TODO: Add loader in sidebar
export const getAllCurrentUserChats = async (
  user: StoreUser,
  cb?: (users: ChatCallback) => void
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
    const chatBetween = data.docs.map((collectionBetweenInstance) => ({
      id: collectionBetweenInstance.id,
      ...collectionBetweenInstance.data(),
    }))

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
            createdAt: key.createdAt || new Date().getTime(),
            users: key.users,
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
  chatUsers: string[]
}

// TODO: handle errors
export const sendMessage = async ({
  chatId,
  user,
  message,
  cb,
  chatUsers,
}: Props) => {
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

  const userChatBetweenRef = (uid = user.uid) =>
    doc(
      db,
      "chatBetween",
      chatId,
      "chatRelatedUser",
      uid
    ) as DocumentReference<ChatUser>

  batch.update(userChatBetweenRef(), { isReadLatestMsg: true })

  chatUsers
    .filter((uid) => user.uid !== uid)
    .map((uid) => {
      batch.update(userChatBetweenRef(uid), { isReadLatestMsg: false })
    })

  await batch.commit()

  if (cb) cb()
}

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
