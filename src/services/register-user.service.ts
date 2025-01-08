import { User } from '@/@types/user'
import { UsersRepository } from '@/repositories/users-repository'

interface RegisterUserServiceRequest {
  userName: string
  avatarUrl?: string
  userMessage?: string
}

interface RegisterUserServiceResponse {
  user: User
}

export class RegisterUserService {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userName,
    avatarUrl,
    userMessage,
  }: RegisterUserServiceRequest): Promise<RegisterUserServiceResponse> {
    const user = await this.userRepository.create({
      userName,
      avatarUrl,
      userMessage,
    })

    return { user }
  }
}
