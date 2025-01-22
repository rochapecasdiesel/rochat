import { UsersRepository } from '@/repositories/users-repository'
import { UserChat } from '@/@types/user'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'

interface GetUserChatsServiceResquest {
  userId: string
  page: number
}

interface UserChatsWithProfiles extends UserChat {
  profiles: {
    id: string
    userName: string
    userMessage: string
    createdAt: Date
    updatedAt: Date
    avatarUrl: string
  }[]
}

interface GetUserChatsServiceResponse {
  userChats: UserChatsWithProfiles[]
}

export class GetUserChatsService {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
    page,
  }: GetUserChatsServiceResquest): Promise<GetUserChatsServiceResponse> {
    const userAlreadyExists = await this.userRepository.findById(userId)

    if (!userAlreadyExists) {
      throw new ResourceNotFoundError()
    }

    const userChats = await this.userRepository.getUserChats(userId, page)

    const userChatsWithProfiles = await Promise.all(
      userChats.map(async (userChat) => {
        // Busca os perfis dos participantes
        const participantsProfiles = await Promise.all(
          userChat.participantId
            .filter((id) => userId !== id)
            .map(async (id) => {
              const profile = await this.userRepository.findById(id)
              if (!profile) {
                throw new ResourceNotFoundError() // Garante que todos os perfis existem
              }
              return profile
            }),
        )

        // Retorna o chat com os perfis adicionados
        return {
          ...userChat,
          profiles: [userAlreadyExists, ...participantsProfiles],
        }
      }),
    )

    return { userChats: userChatsWithProfiles }
  }
}
