import { User } from '@/@types/user'
import { UsersRepository } from '@/repositories/users-repository'
import { UserAllreadyExistsError } from '../erros/user-already-exists-error'

interface RegisterUserServiceRequest {
  userName: string
  documentId: string
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
    documentId,
  }: RegisterUserServiceRequest): Promise<RegisterUserServiceResponse> {
    const userAlreadyExists = await this.userRepository.findById(documentId)

    if (userAlreadyExists) {
      throw new UserAllreadyExistsError()
    }

    const user = await this.userRepository.create({
      id: documentId,
      userName,
      avatarUrl,
      userMessage,
    })

    return { user }
  }
}
