import { Navigate, Outlet } from "react-router-dom"
import SkeletonHolder from "../components/SkeletonHolder"
import { useUser } from "../context/user"
type Props = {
  redirect?: string
  Skeleton?: React.FC
}

const PublicRoutes = ({ redirect = "/", Skeleton = SkeletonHolder }: Props) => {
  const { state } = useUser()
  const { checkingUserInfo, isLogin } = state
  if (checkingUserInfo) return <Skeleton />

  if (isLogin) return <Navigate to={redirect} replace />

  return <Outlet />
}

export default PublicRoutes
