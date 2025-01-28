import { ChatRepository } from '@/repositories/chat-repository'
import { Messages } from '@/@types/chat'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { PermissionDeniedError } from '../erros/permission-denied-error'
import { UsersRepository } from '@/repositories/users-repository'
import { Timestamp, timestampToDate } from '@/utils/timestampToDate'

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

    const oldMessage = await this.chatRepository.findMessageByid(
      chatId,
      messageId,
    )

    const isUserMessage = oldMessage?.senderId === userId

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

    const oldMessageDate = oldMessage?.createdAt
      ? oldMessage.createdAt instanceof Date
        ? oldMessage.createdAt
        : timestampToDate(oldMessage.createdAt as Timestamp)
      : null // Define um valor padrão quando createAt é undefined

    const chatLastDate = isChatAllreadyExists?.lastTimestamp
      ? isChatAllreadyExists.lastTimestamp instanceof Date
        ? isChatAllreadyExists.lastTimestamp
        : timestampToDate(isChatAllreadyExists.lastTimestamp as Timestamp)
      : null // Define um valor padrão quando lastTimestamp é undefined

    await Promise.all(
      isChatAllreadyExists.participants.map(async (id) => {
        const userChat = await this.usersRepository.findUserChatByChatId(
          id,
          chatId,
        )
        if (
          userChat &&
          userChat.lastMessage === message.text &&
          oldMessageDate?.getTime() === chatLastDate?.getTime()
        ) {
          await this.usersRepository.updateUserChat({
            userChatId: userChat.id,
            userId: id,
            data: {
              lastMessage: 'message deleted',
              lastTimestamp: message.createdAt,
            },
          })

          await this.chatRepository.updateChat(chatId, {
            lastMessage: 'message deleted',
            lastTimestamp: message.createdAt,
          })
        }
      }),
    )

    return { message }
  }
}
