import { ChatCreateInput, Chat } from '@/@types/chat'

export interface ChatRepository {
  create(data: ChatCreateInput): Promise<Chat>
  findByParticipants(participants: string[]): Promise<Chat | null>
  // findById(id: string): Promise<Chat | null>
}
