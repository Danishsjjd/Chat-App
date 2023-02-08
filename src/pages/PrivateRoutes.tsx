import { Navigate, Outlet } from "react-router-dom"
import { useUser } from "../context/user"

type Props = {
  redirect?: string
  Skeleton?: () => JSX.Element
}

// TODO: Add Spinner instead of show loading text
const PrivateRoutes = ({
  redirect = "/auth",
  Skeleton = () => <span>Loading...</span>,
}: Props) => {
  const { state } = useUser()
  const { checkingUserInfo } = state

  if (checkingUserInfo) return <Skeleton />

  if (!state.user) return <Navigate to={redirect} replace />

  return <Outlet />
}

export default PrivateRoutes
