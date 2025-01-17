import { ChatRepository } from '@/repositories/chat-repository'
import { Messages } from '@/@types/chat'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { PermissionDeniedError } from '../erros/permission-denied-error'

interface DeleteMessageServiceRequest {
  chatId: string
  messageId: string
  userId: string
}

interface DeleteMessageServiceResponse {
  message: Messages
}

export class DeleteMessageService {
  constructor(private chatRepository: ChatRepository) {}

  async execute({
    chatId,
    messageId,
    userId,
  }: DeleteMessageServiceRequest): Promise<DeleteMessageServiceResponse> {
    // Verifica se o chat existe
    const isChatAllreadyExists = await this.chatRepository.findById(chatId)

    if (!isChatAllreadyExists) {
      throw new ResourceNotFoundError()
    }

    const isUserMessage =
      (await this.chatRepository.findMessageByid(chatId, messageId))
        ?.senderId === userId

    if (!isUserMessage) {
      throw new PermissionDeniedError()
    }

    const message = await this.chatRepository.updateMessage({
      chatId,
      messageId,
      data: {
        deleted: true,
      },
    })

    return { message }
  }
}
