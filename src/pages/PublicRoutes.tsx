import { Navigate, Outlet } from "react-router-dom"
import { useUser } from "../context/user"
type Props = {
  redirect?: string
  Skeleton?: () => JSX.Element
}

const PublicRoutes = ({
  redirect = "/",
  Skeleton = () => <span>Loading...</span>,
}: Props) => {
  const { state } = useUser()
  const { checkingUserInfo, isLogin } = state
  if (checkingUserInfo) return <Skeleton />

  if (isLogin) return <Navigate to={redirect} replace />

  return <Outlet />
}

export default PublicRoutes
