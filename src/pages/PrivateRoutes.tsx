import { User } from "firebase/auth"
import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import UsernameDialog from "../components/UsernameDialog"
import { useUser } from "../context/user"
import { ActionType } from "../context/userReducer"
import { auth } from "../firebase/config"
import { createCurrentUsername } from "../firebase/firestore/user"

type Props = {
  redirect?: string
  Skeleton?: () => JSX.Element
}

const PrivateRoutes = ({
  redirect = "/auth",
  Skeleton = () => <span>Loading...</span>,
}: Props) => {
  const { state, dispatch } = useUser()
  const { checkingUserInfo, isLogin, usernameDialog } = state
  const [isDialogOpen, setIsDialogOpen] = useState(() => usernameDialog)

  useEffect(() => {
    dispatch({ type: ActionType.SetUsernameDialog, payload: isDialogOpen })
  }, [isDialogOpen])

  if (checkingUserInfo) return <Skeleton />

  if (!isLogin) return <Navigate to={redirect} replace />

  const handleSubmit = (username: string) => {
    createCurrentUsername(auth.currentUser as User, username, (user) => {
      dispatch({ type: ActionType.SetUsernameDialog, payload: false })
      dispatch({ type: ActionType.FoundUser, payload: user })
    })
  }

  return (
    <>
      <UsernameDialog
        preventClose
        isDialogOpen={usernameDialog}
        setIsDialogOpen={setIsDialogOpen}
        btnText={"Create Username"}
        handleSubmit={handleSubmit}
        title={"Username"}
        fieldTitle={"Choose Your Username"}
      />
      <Outlet />
    </>
  )
}

export default PrivateRoutes
