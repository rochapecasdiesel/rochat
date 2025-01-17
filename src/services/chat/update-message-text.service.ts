import { ChatRepository } from '@/repositories/chat-repository'
import { Messages } from '@/@types/chat'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { PermissionDeniedError } from '../erros/permission-denied-error'
import { UsersRepository } from '@/repositories/users-repository'

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

    const message = await this.chatRepository.updateMessage({
      chatId,
      messageId,
      data: {
        text,
      },
    })

    await Promise.all(
      isChatAllreadyExists.participants.map(async (id) => {
        const userChat = await this.usersRepository.findUserChatByChatId(
          id,
          chatId,
        )

        if (
          userChat &&
          userChat.lastMessage === message.text &&
          userChat.lastTimestamp === message.createAt
        ) {
          await this.usersRepository.updateUserChat({
            userChatId: userChat.id,
            userId: id,
            data: {
              lastMessage: message.text,
              lastTimestamp: message.createAt,
            },
          })

          await this.chatRepository.updateChat(chatId, {
            lastMessage: message.text,
            lastTimestamp: message.createAt,
          })
        }
      }),
    )

    return { message }
  }
}
