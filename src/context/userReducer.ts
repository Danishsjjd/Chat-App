import { User } from "firebase/auth"

interface SetUser {
  type: "SET_USER"
  payload: User
}

interface NotLogin {
  type: "NOT_LOGIN"
  payload: undefined
}

export type InitialStateType = {
  user: User | null
  isLogin: Boolean
  userCachePresent: Boolean
  checkingUserInfo: Boolean
}

export type Action = SetUser | NotLogin

const userReducer = (
  state: InitialStateType,
  actions: Action
): InitialStateType => {
  const { payload, type } = actions
  switch (type) {
    case "SET_USER":
      return { ...state, user: payload, checkingUserInfo: false, isLogin: true }
    case "NOT_LOGIN":
      return { ...state, checkingUserInfo: false, isLogin: false, user: null }
    default:
      return state
  }
}

export default userReducer
