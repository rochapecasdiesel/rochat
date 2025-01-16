import {
  ChatCreateInput,
  Chat,
  MessagesCreateInput,
  Messages,
  MessagesUpdateInput,
} from '@/@types/chat'

export interface UpdateMessage {
  chatId: string
  messageId: string
  data: MessagesUpdateInput
}

export interface ChatRepository {
  create(data: ChatCreateInput): Promise<Chat>
  findByParticipants(participants: string[]): Promise<Chat | null>
  findById(id: string): Promise<Chat | null>
  createMessagem(chatId: string, data: MessagesCreateInput): Promise<Messages>
  getMessages(chatId: string, page: number): Promise<Messages[]>
  updateMessage(data: UpdateMessage): Promise<Messages>
}
