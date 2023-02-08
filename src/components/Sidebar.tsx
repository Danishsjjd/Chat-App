import { formatRelative, subDays } from "date-fns"
import { useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { BsFilter } from "react-icons/bs"
import createChat from "../assets/icons/create-chat.svg"
import { useUser } from "../context/user"
import { logout } from "../firebase/auth"
import { findFriend } from "../firebase/firestore/chat"
import { StoreUser } from "../types/user"
import { AppDialogProps } from "./Dialog"
import UsernameDialog from "./UsernameDialog"

// TODO: set all data-tip

const lastMsg =
  "latest message will show here Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro quasi doloremque, consequatur adipisci voluptatem expedita incidunt corrupti itaque non cum?"
const friendName = "danish sajjad"
const friendDp = "/logo.svg"

const Sidebar = () => {
  const {
    state: { user },
  } = useUser()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = (username: string) => {
    findFriend(username, user as StoreUser)
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

      <div className="h-[calc(100vh-128px)] overflow-y-auto">
        {Array.from({ length: 10 }).map((_, i) => (
          <FriendSlug
            friendDp={friendDp}
            friendName={friendName}
            lastMsg={lastMsg}
            key={i}
          />
        ))}
        {/* // ! TODO: fix data-tip not showing */}
        {/* // TODO: remove this button when find chat */}
        <button
          className="tooltip w-full rounded bg-zinc-800 py-3 text-xl font-medium text-zinc-200 hover:bg-zinc-700"
          data-tip="hello again"
          onClick={() => setIsDialogOpen(true)}
        >
          Get Started
        </button>
      </div>
    </>
  )
}

type FriendProps = {
  friendDp: string
  lastMsg: string
  friendName: string
}

const FriendSlug = ({}: FriendProps) => {
  return (
    <div className="flex h-20 w-full cursor-pointer items-center justify-between gap-4 pl-2 pr-4 hover:bg-zinc-700/30">
      <img
        src={`${friendDp}`}
        alt="friends chat"
        className="aspect-square h-12 w-12 rounded-full border border-green-800 object-cover "
      />
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-medium line-clamp-1">{friendName}</h3>
          <div className="text-zinc-400">
            {formatRelative(subDays(new Date(), 3), new Date())}
          </div>
        </div>
        <p className="text-zinc-400 line-clamp-1">{lastMsg}</p>
      </div>
    </div>
  )
}

const SearchBar = () => {
  return (
    <div className="flex items-center justify-between gap-3 p-2">
      <div className="flex flex-grow items-center justify-center rounded bg-zinc-700 px-2">
        <IconBtn>
          <AiOutlineSearch className="" />
        </IconBtn>
        <input
          type="text"
          className="w-full rounded bg-transparent p-2 text-zinc-400 outline-none "
          placeholder="Search Chat"
        />
      </div>
      <IconBtn>
        <BsFilter className="" />
      </IconBtn>
    </div>
  )
}

const TopBar = ({ setDialog }: { setDialog: AppDialogProps["setIsOpen"] }) => {
  const { state } = useUser()
  return (
    <div className="flex w-full items-center justify-between bg-zinc-700 p-3">
      <img
        src={state.user?.photoURL}
        alt="user image"
        className="w-12 rounded-full"
      />
      <div className="flex items-center justify-center">
        <IconBtn onClick={() => setDialog(true)}>
          <img src={createChat} alt="chat ico" className="w-8" />
        </IconBtn>
        <button className="btn-ghost btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  )
}

const IconBtn = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
}) => {
  return (
    <button
      className={`tooltip tooltip-bottom rounded-full p-2 hover:bg-zinc-600 ${className}`}
      onClick={onClick}
      data-tip="hello"
    >
      {children}
    </button>
  )
}

export default Sidebar
