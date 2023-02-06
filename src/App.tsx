import { onAuthStateChanged } from "firebase/auth"
import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import { useUser } from "./context/user"
import { auth } from "./firebase/config"
import Auth from "./pages/Auth"
import Chat from "./pages/Chat"
import PrivateRoutes from "./pages/PrivateRoutes"
import PublicRoutes from "./pages/PublicRoutes"

const App = () => {
  const { dispatch } = useUser()
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) dispatch({ type: "SET_USER", payload: user })
      else dispatch({ type: "NOT_LOGIN", payload: undefined })
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
        <Route index element={<Chat />} />
      </Route>
    </Routes>
  )
}

export default App
