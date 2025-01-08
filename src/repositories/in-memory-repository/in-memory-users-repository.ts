import { User, UserCreateInput } from '@/@types/user'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async create(data: UserCreateInput) {
    const user = {
      id: randomUUID(),
      userName: data.userName,
      avatarUrl: data.avatarUrl ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
      userMessage: data.userMessage ?? '',
    }
    this.users.push(user)

    return user
  }
}
