import { User, UserUpdateInput } from '@/@types/user'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

interface UpdateUserServiceRequest extends UserUpdateInput {}

interface UpdateUserServiceResponse {
  user: User
}

export class UpdateUserService {
  constructor(private userRepository: UsersRepository) {}
  async execute(
    id: string,
    { avatarUrl, userMessage, userName }: UpdateUserServiceRequest,
  ): Promise<UpdateUserServiceResponse> {
    const userAlreadyExists = await this.userRepository.findById(id)

    if (!userAlreadyExists) {
      throw new ResourceNotFoundError()
    }

    const user = await this.userRepository.update(id, {
      avatarUrl,
      userMessage,
      userName,
    })

    return { user }
  }
}
