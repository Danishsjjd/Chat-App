import { User } from "firebase/auth"

export const enum ActionType {
  SetUser = "SET_USER",
  SetUsernameDialog = "SET_USERNAME_DIALOG",
  NotLogin = "NOT_LOGIN",
}

type InsertActionType<T extends {}> = T & { type: ActionType }

interface SetUser {
  type: ActionType.SetUser
  payload: User
}

interface SetUsernameDialog {
  type: ActionType.SetUsernameDialog
  payload: undefined
}

interface NotLogin {
  type: ActionType.NotLogin
  payload: undefined
}

export type InitialStateType = {
  user: User | null
  isLogin: boolean
  userCachePresent: boolean
  checkingUserInfo: boolean
  usernameDialog: boolean
}

export type Action = InsertActionType<SetUser | NotLogin | SetUsernameDialog>

const userReducer = (
  state: InitialStateType,
  actions: Action
): InitialStateType => {
  const { payload, type } = actions
  switch (type) {
    case ActionType.SetUser:
      return { ...state, user: payload, checkingUserInfo: false, isLogin: true }
    case ActionType.NotLogin:
      return { ...state, checkingUserInfo: false, isLogin: false, user: null }
    case ActionType.SetUsernameDialog:
      return state
    default:
      return state
  }
}

export default userReducer
