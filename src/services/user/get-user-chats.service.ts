import { UsersRepository } from '@/repositories/users-repository'
import { UserChat } from '@/@types/user'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'

interface GetUserChatsServiceResquest {
  userId: string
  page: number
}

interface GetUserChatsServiceResponse {
  userChats: UserChat[]
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

    return { userChats }
  }
}
