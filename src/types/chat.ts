export type Chat = {
  // ! root doc have same id as ChatBetween
  username: string
  message?: string
  file?: string
  createAt: Date // <- index here
}

export type ChatBetween = {
  // ! save id as Chat
  latestMessage: string
  users: string[] // id will be userId
}

export type ChatUser = {
  photoUrl: string
  username: string
  isReadLatestMsg: boolean
}
