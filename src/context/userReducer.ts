import { StoreUser } from "../types/user"

export const enum ActionType {
  SetUser = "SET_USER",
  SetUsernameDialog = "SET_USERNAME_DIALOG",
  NotLogin = "NOT_LOGIN",
  YesLogin = "YEST_LOGIN",
}

type InsertActionType<T extends {}> = T & { type: ActionType }

interface SetUser {
  type: ActionType.SetUser
  payload: StoreUser
}

interface YesLogin {
  type: ActionType.YesLogin
  payload: undefined
}

interface SetUsernameDialog {
  type: ActionType.SetUsernameDialog
  payload: boolean
}

interface NotLogin {
  type: ActionType.NotLogin
  payload: undefined
}

export type InitialStateType = {
  user: StoreUser | null
  isLogin: boolean
  userCachePresent: boolean
  checkingUserInfo: boolean
  usernameDialog: boolean
}

export type Action = InsertActionType<
  SetUser | NotLogin | SetUsernameDialog | YesLogin
>

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
    case ActionType.YesLogin:
      return { ...state, checkingUserInfo: false, isLogin: true, user: null }
    case ActionType.SetUsernameDialog:
      return { ...state, usernameDialog: payload }
    default:
      return state
  }
}

export default userReducer
