import {
  ChatCreateInput,
  Chat,
  MessagesCreateInput,
  Messages,
} from '@/@types/chat'

export interface ChatRepository {
  create(data: ChatCreateInput): Promise<Chat>
  findByParticipants(participants: string[]): Promise<Chat | null>
  findById(id: string): Promise<Chat | null>
  createMessagem(chatId: string, data: MessagesCreateInput): Promise<Messages>
  getMessages(chatId: string, page: number): Promise<Messages[]>
}
