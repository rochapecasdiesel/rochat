import { Chat } from '@/@types/chat'

export class ChatAlreadyExist extends Error {
  public chat: Chat
  constructor(chat: Chat) {
    super(`Chat with ID ${chat.id} already exists`)
    this.chat = chat
    Error.captureStackTrace(this, ChatAlreadyExist)
  }
}
