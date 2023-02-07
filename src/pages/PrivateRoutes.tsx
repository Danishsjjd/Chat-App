import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import UsernameDialog from "../components/UsernameDIalog"
import { useUser } from "../context/user"
import { ActionType } from "../context/userReducer"
import { createCurrentUsername } from "../firebase/firestore"
import { auth } from "../firebase/config"
import { User } from "firebase/auth"

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

  const handleSubmit = (e: React.FormEvent, username: string) => {
    e.preventDefault()

    createCurrentUsername(auth.currentUser as User, username, () => {
      dispatch({ type: ActionType.SetUsernameDialog, payload: false })
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
