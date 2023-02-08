import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { IoSend } from "react-icons/io5"
import { MdPhotoSizeSelectActual } from "react-icons/md"
import { useParams } from "react-router-dom"
import { useUser } from "../context/user"
import { messagesListener, sendMessage } from "../firebase/firestore/chat"
import { Chat } from "../types/chat"
import { StoreUser } from "../types/user"
import IconBtn from "./IconBtn"

const ActiveChat = () => {
  const [haveChat, setHaveChat] = useState(true)
  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <Messages setHaveChat={setHaveChat} haveChat={haveChat} />
      <MessageInput haveChat={haveChat} />
    </div>
  )
}

const Messages = ({
  setHaveChat,
  haveChat,
}: {
  setHaveChat: Dispatch<SetStateAction<boolean>>
  haveChat: boolean
}) => {
  const { id } = useParams()
  const [{ messages }, setMessages] = useState<Chat>({ messages: [] })
  // TODO: remove
  useEffect(() => {
    const unsub = messagesListener(id as string, (chat) => {
      if (chat.messages.length > 0 && !haveChat) setHaveChat(true)
      else if (chat.messages.length <= 0 && haveChat) setHaveChat(false)

      setMessages(chat)
    })
    return () => {
      unsub.then((data) => data())
    }
  }, [id])

  const betterTypeMessages = messages.map((data) => ({
    ...data,
    createAt:
      typeof data.createAt == "number"
        ? data.createAt
        : ((data.createAt as any).toMillis() as number),
  }))
  return (
    <div className="flex-grow">
      {betterTypeMessages
        .sort((a, b) => b.createAt - a.createAt)
        // TODO: check if we can find a better way
        .reverse()
        .map((data) => {
          return <div key={data.id}>{data.message}</div>
        })}
    </div>
  )
}

const TopBar = () => {
  return <div className="h-20 w-full rounded bg-zinc-700"></div>
}

const MessageInput = ({ haveChat }: { haveChat: boolean }) => {
  const { id } = useParams()
  const { state } = useUser()
  const [message, setMessage] = useState("")
  const msgSendHandler = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage({
      message,
      chatId: id as string,
      user: state.user as StoreUser,
      haveChat,
    })
  }
  return (
    <div className="flex h-20 items-center gap-3 bg-zinc-800 p-2 pb-5">
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
