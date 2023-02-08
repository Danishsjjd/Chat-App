import { StoreUser } from "../types/user"

export const enum ActionType {
  FoundUser = "SET_USER",
  SetUsernameDialog = "SET_USERNAME_DIALOG",
  NotLogin = "NOT_LOGIN",
}

type InsertActionType<T extends {}> = T & { type: ActionType }

interface SetUser {
  type: ActionType.FoundUser
  payload: StoreUser
}

interface SetUsernameDialog {
  type: ActionType.SetUsernameDialog
  payload: boolean
}

interface SetLogin {
  type: ActionType.NotLogin
  payload: undefined
}

export type Action = InsertActionType<SetUser | SetLogin | SetUsernameDialog>

export type InitialStateType = {
  user: StoreUser | null
  isLogin: boolean
  userCachePresent: boolean
  checkingUserInfo: boolean
  usernameDialog: boolean
}

const userReducer = (
  state: InitialStateType,
  actions: Action
): InitialStateType => {
  const { payload, type } = actions
  switch (type) {
    case ActionType.FoundUser:
      return { ...state, user: payload, checkingUserInfo: false, isLogin: true }
    case ActionType.NotLogin:
      return { ...state, checkingUserInfo: false, isLogin: false, user: null }
    case ActionType.SetUsernameDialog:
      return { ...state, usernameDialog: payload }
    default:
      return state
  }
}

export default userReducer
