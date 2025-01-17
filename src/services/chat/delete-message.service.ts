import { ChatRepository } from '@/repositories/chat-repository'
import { Messages } from '@/@types/chat'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { PermissionDeniedError } from '../erros/permission-denied-error'
import { UsersRepository } from '@/repositories/users-repository'

interface DeleteMessageServiceRequest {
  chatId: string
  messageId: string
  userId: string
}

interface DeleteMessageServiceResponse {
  message: Messages
}

export class DeleteMessageService {
  constructor(
    private chatRepository: ChatRepository,
    private usersRepository: UsersRepository,
  ) {}

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

    await Promise.all(
      isChatAllreadyExists.participants.map(async (id) => {
        const userChat = await this.usersRepository.findUserChatByChatId(
          id,
          chatId,
        )

        if (userChat && userChat.lastMessage === message.text) {
          await this.usersRepository.updateUserChat({
            userChatId: userChat.id,
            userId: id,
            data: {
              lastMessage: 'message deleted',
              lastTimestamp: message.createAt,
            },
          })

          await this.chatRepository.updateChat(chatId, {
            lastMessage: 'message deleted',
            lastTimestamp: message.createAt,
          })
        }
      }),
    )

    return { message }
  }
}
