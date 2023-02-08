import { MdPhotoSizeSelectActual } from "react-icons/md"
import { IoSend } from "react-icons/io5"
import IconBtn from "./IconBtn"

const ActiveChat = () => {
  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <div className="flex-grow">hi</div>
      <MessageInput />
    </div>
  )
}

const TopBar = () => {
  return <div className="h-20 w-full rounded bg-zinc-700"></div>
}

const MessageInput = () => {
  return (
    <div className="flex h-20 items-center gap-3 bg-zinc-800 p-2 pb-5">
      <IconBtn tooltip="send files" className="tooltip-top hover:bg-zinc-500">
        <MdPhotoSizeSelectActual />
      </IconBtn>
      <input
        type="text"
        className="input-ghost input w-full"
        placeholder="Enter Message Here"
      />
      <IconBtn tooltip="send" className="tooltip-top hover:bg-zinc-500">
        <IoSend />
      </IconBtn>
    </div>
  )
}

export default ActiveChat
