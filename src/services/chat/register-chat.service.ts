import { ChatRepository } from '@/repositories/chat-repository'
import { Chat, Messages } from '@/@types/chat'
import { ChatAlreadyExist } from '../erros/chat-already-exist-error'

interface CreateChatServiceRequest {
  id?: string
  participants: string[]
  assingnedUser: string
  status: 'assigned' | 'open'
  createAt?: Date
  updatedAt?: Date
  lastMessage?: string
  lastTimestamp?: Date
  messages?: Messages[]
}

interface CreateChatServiceResponse {
  chat: Chat
}

export class CreateChatService {
  constructor(private chatRepository: ChatRepository) {}

  async execute({
    id,
    participants,
    assingnedUser,
    status,
    createAt,
    updatedAt,
    lastMessage,
    lastTimestamp,
    messages,
  }: CreateChatServiceRequest): Promise<CreateChatServiceResponse> {
    const isChatExist =
      await this.chatRepository.findByParticipants(participants)

    if (isChatExist) {
      throw new ChatAlreadyExist()
    }

    const chat = await this.chatRepository.create({
      id,
      participants,
      assingnedUser,
      status,
      createAt,
      updatedAt,
      lastMessage,
      lastTimestamp,
      messages,
    })

    return { chat }
  }
}
