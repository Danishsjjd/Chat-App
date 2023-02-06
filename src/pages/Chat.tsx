import { useUser } from "../context/user"

const Chat = () => {
  const { state } = useUser()
  console.log(state)
  return <div>Chat</div>
}

export default Chat
