import { ChatRepository } from '@/repositories/chat-repository'
import { Chat } from '@/@types/chat'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'

interface GetChatByIdServiceRequest {
  chatId: string
}

interface GetChatByIdServiceResponse {
  chat: Chat
}

export class GetChatByIdService {
  constructor(private chatRepository: ChatRepository) {}

  async execute({
    chatId,
  }: GetChatByIdServiceRequest): Promise<GetChatByIdServiceResponse> {
    const chat = await this.chatRepository.findById(chatId)

    if (!chat) {
      throw new ResourceNotFoundError()
    }

    return { chat }
  }
}
