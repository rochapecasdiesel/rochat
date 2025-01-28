import { ChatRepository } from '@/repositories/chat-repository'
import { Messages } from '@/@types/chat'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { PermissionDeniedError } from '../erros/permission-denied-error'
import { UsersRepository } from '@/repositories/users-repository'
import { Timestamp, timestampToDate } from '@/utils/timestampToDate'

interface UpdateMessageTextServiceRequest {
  chatId: string
  messageId: string
  userId: string
  text: string
}

interface UpdateMessageTextServiceResponse {
  message: Messages
}

export class UpdateMessageTextService {
  constructor(
    private chatRepository: ChatRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    chatId,
    messageId,
    userId,
    text,
  }: UpdateMessageTextServiceRequest): Promise<UpdateMessageTextServiceResponse> {
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

    const oldMessage = await this.chatRepository.findMessageByid(
      chatId,
      messageId,
    )

    const message = await this.chatRepository.updateMessage({
      chatId,
      messageId,
      data: {
        text,
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

    // Verifica se ambas as datas são válidas antes de compará-las
    if (
      oldMessageDate &&
      chatLastDate &&
      oldMessageDate.getTime() === chatLastDate.getTime()
    ) {
      await Promise.all(
        isChatAllreadyExists.participants.map(async (id) => {
          const userChat = await this.usersRepository.findUserChatByChatId(
            id,
            chatId,
          )

          if (userChat) {
            await this.usersRepository.updateUserChat({
              userChatId: userChat.id,
              userId: id,
              data: {
                lastMessage: message.text,
                lastTimestamp: message.createdAt,
              },
            })
          }

          await this.chatRepository.updateChat(chatId, {
            lastMessage: message.text,
            lastTimestamp: message.createdAt,
          })
        }),
      )
    }

    return { message }
  }
}
