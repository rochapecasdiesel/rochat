import { ChatRepository } from '@/repositories/chat-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { Chat, Messages } from '@/@types/chat'
import { ChatAlreadyExist } from '../erros/chat-already-exist-error'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'

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

    if (participantsInDB.some((participant) => participant === null)) {
      throw new ResourceNotFoundError()
    }

    const isChatExist = await this.chatRepository.findByParticipants(
      participantsInDB.map((participant) => participant!.id),
    )

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

    return { chat }
  }
}
