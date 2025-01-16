import { ChatRepository } from '@/repositories/chat-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { Chat, Messages } from '@/@types/chat'
import { ChatAlreadyExist } from '../erros/chat-already-exist-error'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { UserChat } from '@/@types/user'
import { ParticipantsWithSameId } from '../erros/participants-with-same-id'

interface CreateChatServiceRequest {
  id?: string
  participants: string[]
  assingnedUser: string
  status: 'assigned' | 'open'
  createAt?: Date
  updatedAt?: Date
  lastMessage?: string
  lastTimestamp?: Date
  messages?: Messages[]
}

interface CreateChatServiceResponse {
  chat: Chat
}

export class CreateChatService {
  constructor(
    private chatRepository: ChatRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    id,
    participants,
    assingnedUser,
    status,
    createAt,
    updatedAt,
    lastMessage,
    lastTimestamp,
    messages,
  }: CreateChatServiceRequest): Promise<CreateChatServiceResponse> {
    const participantsInDB = await Promise.all(
      participants.map((participantId) =>
        this.usersRepository.findById(participantId),
      ),
    )

    // Se algum participante não existir retorna um erro
    if (participantsInDB.some((participant) => participant === null)) {
      throw new ResourceNotFoundError()
    }

    const areAllParticipantsEqual = participantsInDB.every(
      (participant) => participant?.id === participantsInDB[0]?.id,
    )

    // Se caso todos participantes foram iguais, deve se retornar um erro
    if (participantsInDB.length > 1 && areAllParticipantsEqual) {
      throw new ParticipantsWithSameId()
    }

    const isChatExist = await this.chatRepository.findByParticipants(
      participantsInDB.map((participant) => participant!.id),
    )

    // Se já existir um chat deve se retornar um erro
    if (isChatExist) {
      throw new ChatAlreadyExist()
    }

    const chat = await this.chatRepository.create({
      id,
      participants,
      assingnedUser,
      status,
      createAt,
      updatedAt,
      lastMessage,
      lastTimestamp,
      messages,
    })

    await Promise.all(
      participantsInDB.map(async (participant) => {
        if (participant) {
          const updatedUserChats = Array.isArray(participant.userChats)
            ? participant.userChats
            : []

          const newUserChat = {
            assignedUser: assingnedUser,
            lastMessage: '',
            lastTimestamp: new Date(),
            participantId: participants,
            chatId: chat.id,
          } as UserChat

          updatedUserChats.push(newUserChat)

          // Atualiza o participante no repositório com o novo array
          await this.usersRepository.update(participant.id, {
            userChats: updatedUserChats,
          })
        }
      }),
    )

    return { chat }
  }
}
