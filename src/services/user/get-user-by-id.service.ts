import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { User } from '@/@types/user'

interface GetUserByIdServiceResponse {
  user: User
}

export class GetUserByIdService {
  constructor(private userRepository: UsersRepository) {}

  async execute(id: string): Promise<GetUserByIdServiceResponse> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
