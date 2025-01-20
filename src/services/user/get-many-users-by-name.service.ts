import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@/@types/user'

interface GetManyUserByNameServiceResponse {
  users: User[]
}

export class GetManyUsersByNameService {
  constructor(private userRepository: UsersRepository) {}

  async execute(
    name: string,
    page: number,
  ): Promise<GetManyUserByNameServiceResponse> {
    const users = await this.userRepository.findManyByName(name, page)

    return { users }
  }
}
