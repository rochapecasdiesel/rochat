import { ChatRepository } from '@/repositories/chat-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { Messages } from '@/@types/chat'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'

interface CreateMessageServiceRequest {
  chatId: string
  senderId: string
  text: string
  source: 'internal' | 'external'
  deleted: boolean
  altered: boolean
}

interface CreateMessageServiceResponse {
  message: Messages
}

export class CreateMessageService {
  constructor(
    private chatRepository: ChatRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    altered,
    chatId,
    deleted,
    senderId,
    source,
    text,
  }: CreateMessageServiceRequest): Promise<CreateMessageServiceResponse> {
    // Verifica se o chat existe
    const isChatAllreadyExists = await this.chatRepository.findById(chatId)

    if (!isChatAllreadyExists) {
      throw new ResourceNotFoundError()
    }

    // Criação da mensagem
    const message = await this.chatRepository.createMessagem(chatId, {
      altered,
      deleted,
      senderId,
      source,
      text,
    })

    // Atualiza os chats de cada participante
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
      }),
    )

    return { message }
  }
}
