import { User, UserCreateInput } from '@/@types/user'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async create(data: UserCreateInput) {
    const user = {
      id: data.id,
      userName: data.userName,
      avatarUrl: data.avatarUrl ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
      userMessage: data.userMessage ?? '',
    }
    this.users.push(user)

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id)

    if (!user) {
      return null
    }

    return user
  }
}
