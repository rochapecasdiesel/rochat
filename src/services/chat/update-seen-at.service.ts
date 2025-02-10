import { ChatRepository } from '@/repositories/chat-repository'
import { Messages } from '@/@types/chat'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { Timestamp } from 'firebase-admin/firestore'
import { PermissionDeniedError } from '../erros/permission-denied-error'

interface UpdateSeenMessageServiceRequest {
  chatId: string
  messagesId: string[]
  userId: string
}

interface UpdateSeenMessageServiceResponse {
  messages: Messages[]
}

export class UpdateSeenMessageService {
  constructor(private chatRepository: ChatRepository) {}

  async execute({
    chatId,
    messagesId,
    userId,
  }: UpdateSeenMessageServiceRequest): Promise<UpdateSeenMessageServiceResponse> {
    // Verifica se o chat existe
    const isChatAllreadyExists = await this.chatRepository.findById(chatId)

    if (!isChatAllreadyExists) {
      throw new ResourceNotFoundError()
    }

    const messages: Messages[] = []

    for (const messageId of messagesId) {
      const isMessageAllreadyExists = await this.chatRepository.findMessageByid(
        chatId,
        messageId,
      )

      if (!isMessageAllreadyExists) {
        throw new ResourceNotFoundError()
      }

      if (isMessageAllreadyExists.senderId === userId) {
        throw new PermissionDeniedError()
      }

      const message = await this.chatRepository.updateMessage({
        chatId: isChatAllreadyExists.id,
        messageId,
        data: {
          seenAt: Timestamp.now(),
        },
      })

      messages.push(message)
    }

    return {
      messages,
    }
  }
}
