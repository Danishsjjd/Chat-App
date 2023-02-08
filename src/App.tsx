import { Route, Routes } from "react-router-dom"
import ActiveChat from "./components/ActiveChat"
import Chat from "./components/Chat"
import ChatLayout from "./components/ChatLayout"
import { useOnAuthChange } from "./firebase/auth"
import Auth from "./pages/Auth"
import PrivateRoutes from "./pages/PrivateRoutes"
import PublicRoutes from "./pages/PublicRoutes"
import Username from "./pages/Username"

const App = () => {
  useOnAuthChange()
  return (
    <Routes>
      <Route path="/" element={<PublicRoutes />}>
        <Route path="/auth" element={<Auth />} />
      </Route>

      <Route path="/username" element={<Username />} />

      <Route path="/" element={<PrivateRoutes />}>
        <Route path="/" element={<ChatLayout />}>
          <Route index element={<Chat />} />
          <Route path="/chat/:id" element={<ActiveChat />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
