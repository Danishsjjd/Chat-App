import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { IoSend } from "react-icons/io5"
import { MdPhotoSizeSelectActual } from "react-icons/md"
import { useParams } from "react-router-dom"
import { useUser } from "../context/user"
import { messagesListener, sendMessage } from "../firebase/firestore/chat"
import { Chat } from "../types/chat"
import { StoreUser } from "../types/user"
import IconBtn from "./IconBtn"
import { CurrentUserSvg, FriendSvg } from "./Svg"

const ActiveChat = () => {
  return (
    <div className="relative h-full">
      <TopBar />
      <Messages />
      <MessageInput />
    </div>
  )
}

const Messages = ({}) => {
  const { id } = useParams()
  const [messages, setMessages] = useState<Chat[]>([])
  const {
    state: { user },
  } = useUser()

  useEffect(() => {
    const unsub = messagesListener(id as string, (chat) => {
      setMessages(chat)
    })
    return () => {
      unsub.then((data) => data())
    }
  }, [id])

  return (
    <div className="max-h-[calc(100vh-80px)] space-y-1 overflow-y-auto p-4 pb-[90px]">
      {messages.map((data) => {
        const isUserMsg = data.username == user?.username
        return (
          <div
            key={data.id}
            className={`flex max-w-[49%]  ${
              isUserMsg ? "ml-auto justify-end" : "justify-start"
            }`}
          >
            <p
              className={`relative bg-green-700 p-2 ${
                isUserMsg
                  ? " rounded-l rounded-bl rounded-br"
                  : " rounded-r rounded-br rounded-bl"
              }`}
            >
              <span
                className={`absolute top-0 text-green-700 ${
                  isUserMsg ? "-right-2" : "-left-2"
                }`}
              >
                {isUserMsg ? <CurrentUserSvg /> : <FriendSvg />}
              </span>
              <span>{data.message}</span>
            </p>
          </div>
        )
      })}
    </div>
  )
}

const TopBar = () => {
  return <div className="h-20 w-full rounded bg-zinc-700"></div>
}

const MessageInput = ({}) => {
  const { id } = useParams()
  const { state } = useUser()
  const [message, setMessage] = useState("")

  const msgSendHandler = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage({
      message,
      chatId: id as string,
      user: state.user as StoreUser,
      cb() {
        setMessage("")
      },
    })
  }

  return (
    <div className="absolute bottom-0 flex h-20 w-full items-center gap-3 bg-zinc-800 p-2 pb-5">
      <IconBtn tooltip="send files" className="tooltip-top hover:bg-zinc-500">
        <MdPhotoSizeSelectActual />
      </IconBtn>
      <form onSubmit={msgSendHandler} className="flex flex-grow gap-2">
        <input
          type="text"
          className="input-ghost input w-full"
          placeholder="Enter Message Here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconBtn tooltip="send" className="tooltip-top hover:bg-zinc-500">
          <IoSend />
        </IconBtn>
      </form>
    </div>
  )
}

export default ActiveChat
