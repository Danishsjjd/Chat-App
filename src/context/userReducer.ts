import { StoreUser } from "../types/user"

export const enum ActionType {
  FoundUser = "SET_USER",
  SetLogin = "NOT_LOGIN",
}

type InsertActionType<T extends {}> = T & { type: ActionType }

interface SetUser {
  type: ActionType.FoundUser
  payload: StoreUser
}

interface SetLogin {
  type: ActionType.SetLogin
  payload: boolean
}

export type Action = InsertActionType<SetUser | SetLogin>

export type InitialStateType = {
  user: StoreUser | null
  isLogin: boolean
  checkingUserInfo: boolean
}

const userReducer = (
  state: InitialStateType,
  actions: Action
): InitialStateType => {
  const { payload, type } = actions
  switch (type) {
    case ActionType.FoundUser:
      return { ...state, user: payload, checkingUserInfo: false, isLogin: true }
    case ActionType.SetLogin:
      return { ...state, checkingUserInfo: false, isLogin: payload, user: null }
    default:
      return state
  }
}

export default userReducer
