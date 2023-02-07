import { onAuthStateChanged } from "firebase/auth"
import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import ActiveChat from "./components/ActiveChat"
import Chat from "./components/Chat"
import ChatLayout from "./components/ChatLayout"
import { useUser } from "./context/user"
import { ActionType } from "./context/userReducer"
import { auth } from "./firebase/config"
import { findCurrentUser } from "./firebase/firestore"
import Auth from "./pages/Auth"
import PrivateRoutes from "./pages/PrivateRoutes"
import PublicRoutes from "./pages/PublicRoutes"

const App = () => {
  const { dispatch } = useUser()
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: ActionType.SetUser, payload: user })
        findCurrentUser(user)
      } else dispatch({ type: ActionType.NotLogin, payload: undefined })
    })
    return () => {
      unSub()
    }
  }, [])
  return (
    <Routes>
      <Route path="/" element={<PublicRoutes />}>
        <Route path="/auth" element={<Auth />} />
      </Route>

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
