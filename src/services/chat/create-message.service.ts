import { ChatRepository } from '@/repositories/chat-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { Messages } from '@/@types/chat'
import { UserChat } from '@/@types/user'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'

interface CreateMessageServiceRequest {
  chatId: string
  senderId: string
  recieverId: string
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
    recieverId,
    senderId,
    source,
    text,
  }: CreateMessageServiceRequest): Promise<CreateMessageServiceResponse> {
    // Verifica se o chat existe
    const isChatAllreadyExists = await this.chatRepository.findById(chatId)

    if (!isChatAllreadyExists) {
      throw new ResourceNotFoundError()
    }

    const hasValidParticipants = isChatAllreadyExists.participants.every(
      (value) => [senderId, recieverId].includes(value),
    )

    if (!hasValidParticipants) {
      throw new ResourceNotFoundError()
    }

    // Criação da mensagem
    const message = await this.chatRepository.createMessagem(chatId, {
      altered,
      deleted,
      recieverId,
      senderId,
      source,
      text,
    })

    // Atualiza os chats de cada participante
    await Promise.all(
      isChatAllreadyExists.participants.map(async (id) => {
        const user = await this.usersRepository.findById(id)

        if (user) {
          // Converte a mensagem em um UserChat
          const newUserChat: UserChat = {
            chatId,
            participantId: [senderId, recieverId], // Atribui os IDs dos participantes
            lastMessage: message.text, // Usa o texto da mensagem como o último texto
            lastTimestamp: message.createAt, // Usando a data de criação da mensagem como timestamp
            assignedUser: 'assigned',
          }

          // Adiciona o UserChat à lista de chats do usuário
          user.userChats = user.userChats
            ? [...user.userChats, newUserChat]
            : [newUserChat]

          // Atualiza o usuário no repositório
          await this.usersRepository.update(id, { userChats: user.userChats })
        }
      }),
    )

    return { message }
  }
}
