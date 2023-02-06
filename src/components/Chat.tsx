import MainImg from "../assets/icons/main.svg"

const Chat = () => {
  return (
    <aside className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-800">
      <img src={MainImg} alt="main image" className="w-96" />
      <h3 className="text-4xl font-medium ">Chat App</h3>
      <p className="text-center text-zinc-400">
        Send receive message from any where around the glob
        <br />
        This Chat App is very easy to use all you need is a google account
      </p>
    </aside>
  )
}

export default Chat
