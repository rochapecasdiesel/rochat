import { ChatRepository } from '@/repositories/chat-repository'
import { Messages } from '@/@types/chat'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'

interface GetMessagesServiceRequest {
  chatId: string
  page: number
}

interface GetMessagesServiceResponse {
  messages: Messages[]
}

export class GetMessagesService {
  constructor(private chatRepository: ChatRepository) {}

  async execute({
    chatId,
    page = 1,
  }: GetMessagesServiceRequest): Promise<GetMessagesServiceResponse> {
    const isChatAllreadyExists = await this.chatRepository.findById(chatId)

    if (!isChatAllreadyExists) {
      throw new ResourceNotFoundError()
    }

    const messages = await this.chatRepository.getMessages(chatId, page)

    return { messages }
  }
}
