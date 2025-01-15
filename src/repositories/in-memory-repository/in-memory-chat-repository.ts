import { Chat, ChatCreateInput } from '@/@types/chat'
import { ChatRepository } from '../chat-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryChatRepository implements ChatRepository {
  public chats: Chat[] = []

  async create(data: ChatCreateInput): Promise<Chat> {
    const chat: ChatCreateInput = {
      ...data,
      id: data.id ? data.id : randomUUID(),
      createAt: data.createAt ? data.createAt : new Date(),
    }
    this.chats.push(chat as Chat)
    return chat as Chat
  }

  async findByParticipants(participants: string[]): Promise<Chat | null> {
    return (
      this.chats.find(
        (chat) =>
          chat.participants.includes(participants[0]) &&
          chat.participants.includes(participants[1]),
      ) || null
    )

    // async findById(id: string): Promise<Chat | null> {
    //   return this.chats.find(chat => chat.id === id) || null
    // }
  }
}
