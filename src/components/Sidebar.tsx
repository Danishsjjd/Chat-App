import { formatRelative } from "date-fns"
import { useEffect, useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { BsFilter } from "react-icons/bs"
import { Link, useParams } from "react-router-dom"
import createChat from "../assets/icons/create-chat.svg"
import { useUser } from "../context/user"
import { logout } from "../firebase/auth"
import { findFriend, getAllCurrentUserChats } from "../firebase/firestore/chat"
import { ChatRelatedUsers } from "../types/chat"
import { StoreUser } from "../types/user"
import { AppDialogProps } from "./Dialog"
import IconBtn from "./IconBtn"
import UsernameDialog from "./UsernameDialog"

const Sidebar = () => {
  const {
    state: { user },
  } = useUser()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [chats, setChats] = useState<ChatRelatedUsers[]>([])

  useEffect(() => {
    const unsub = getAllCurrentUserChats(user as StoreUser, (userData) => {
      setChats((pre) => {
        if (userData.username === user?.username) return pre

        const exists =
          pre.filter((data) => data.chatId === userData.chatId).length > 0
        if (exists) return pre

        return [...pre, userData]
      })
    })
    return () => {
      unsub.then((data) => {
        if (data) data()
      })
    }
  }, [])

  const handleSubmit = async (username: string) => {
    findFriend(username, user as StoreUser).then((data) => {
      if (data) setIsDialogOpen(false)
    })
  }
  return (
    <>
      <UsernameDialog
        isDialogOpen={isDialogOpen}
        btnText="Create Chat"
        fieldTitle="Enter Your Friend Username"
        handleSubmit={handleSubmit}
        setIsDialogOpen={setIsDialogOpen}
        title={"Friend's Name"}
      />
      <TopBar setDialog={setIsDialogOpen} />
      <SearchBar />

      <div className="h-[calc(100vh-136px)] overflow-y-auto">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <FriendSlug
              friendDp={chat.photoURL}
              friendName={chat.username}
              lastMsg={chat.lastMsg}
              key={chat.chatId}
              createdAt={
                typeof chat.createdAt === "number"
                  ? chat.createdAt
                  : (chat.createdAt as any).toMillis()
              }
              chatId={chat.chatId}
            />
          ))
        ) : (
          <button
            className="tooltip tooltip-bottom w-full rounded bg-zinc-800 py-3 text-xl font-medium text-zinc-200 hover:bg-zinc-700"
            data-tip="Start Conversation"
            onClick={() => setIsDialogOpen(true)}
          >
            Get Started
          </button>
        )}
      </div>
    </>
  )
}

type FriendProps = {
  friendDp: string
  lastMsg: string
  friendName: string
  createdAt: Date
  chatId: string
}

const FriendSlug = ({
  friendDp,
  friendName,
  lastMsg,
  createdAt,
  chatId,
}: FriendProps) => {
  const { id } = useParams()
  const isActive = id === chatId
  return (
    <Link
      className={`flex h-20 w-full cursor-pointer items-center justify-between gap-4 pl-2 pr-4 hover:bg-zinc-700/30 ${
        isActive && "bg-zinc-700/30"
      }`}
      to={`/chat/${chatId}`}
    >
      <img
        src={`${friendDp}`}
        alt="friends chat"
        className="aspect-square h-12 w-12 rounded-full border border-green-800 object-cover "
      />
      <div className="w-full">
        <div className="flex w-full items-center justify-between gap-3">
          <h3 className="text-xl font-medium line-clamp-1">{friendName}</h3>
          <div className="text-zinc-400">
            {formatRelative(createdAt, new Date())}
          </div>
        </div>
        <p className="text-zinc-400 line-clamp-1">{lastMsg}</p>
      </div>
    </Link>
  )
}

const SearchBar = () => {
  return (
    <div className="flex items-center justify-between gap-3 p-2">
      <div className="flex flex-grow items-center justify-center rounded bg-zinc-700 px-2">
        <IconBtn tooltip="search">
          <AiOutlineSearch className="" />
        </IconBtn>
        <input
          type="text"
          className="w-full rounded bg-transparent p-2 text-zinc-400 outline-none "
          placeholder="Search Chat"
        />
      </div>
      <IconBtn tooltip="show unread chats">
        <BsFilter className="" />
      </IconBtn>
    </div>
  )
}

const TopBar = ({ setDialog }: { setDialog: AppDialogProps["setIsOpen"] }) => {
  const { state } = useUser()
  return (
    <div className="flex h-20 w-full items-center justify-between bg-zinc-700 p-3">
      <img
        src={state.user?.photoURL}
        alt="user image"
        className="w-12 rounded-full"
      />
      <div className="flex items-center justify-center">
        <IconBtn onClick={() => setDialog(true)} tooltip="start new chat">
          <img src={createChat} alt="chat ico" className="w-8" />
        </IconBtn>
        <button className="btn-ghost btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
