import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

const ChatLayout = () => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-900 text-white">
      <div className="mx-auto flex max-w-[1500px] gap-2 overflow-hidden rounded  xl:py-3">
        <div className="fixed -translate-x-[100%] md:relative md:w-[33%] md:translate-x-0">
          <Sidebar />
        </div>
        <div className="md:w-[67%]">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default ChatLayout
