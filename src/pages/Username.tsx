import { User } from "firebase/auth"
import { useState } from "react"
import { Navigate } from "react-router-dom"
import UsernameDialog from "../components/UsernameDialog"
import { useUser } from "../context/user"
import { ActionType } from "../context/userReducer"
import { auth } from "../firebase/config"
import { createCurrentUsername } from "../firebase/firestore/user"

const Username = () => {
  const {
    state: { isLogin, user },
    dispatch,
  } = useUser()

  const [isDialogOpen, setIsDialogOpen] = useState(true)

  if (!isLogin) return <Navigate to={"/auth"} replace={true} />
  if (user) return <Navigate to="/" replace={true} />

  const handleSubmit = (username: string) => {
    createCurrentUsername(auth.currentUser as User, username, (user) => {
      dispatch({ type: ActionType.FoundUser, payload: user })
    })
  }

  return (
    <UsernameDialog
      preventClose
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
      btnText={"Create Username"}
      handleSubmit={handleSubmit}
      title={"Username"}
      fieldTitle={"Choose Your Username"}
    />
  )
}

export default Username
