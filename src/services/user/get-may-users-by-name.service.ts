import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@/@types/user'

interface GetManyUserByNameServiceResponse {
  users: User[]
}

export class GetManyUsersByIdService {
  constructor(private userRepository: UsersRepository) {}

  async execute(name: string): Promise<GetManyUserByNameServiceResponse> {
    const users = await this.userRepository.findManyByName(name)

    return { users }
  }
}
