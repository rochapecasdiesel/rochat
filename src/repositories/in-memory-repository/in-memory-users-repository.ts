import { User, UserCreateInput, UserUpdateInput } from '@/@types/user'
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

  async findById(id: string) {
    const user = this.users.find((user) => user.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findManyByName(name: string) {
    const users = this.users.filter((user) =>
      user.userName.toLowerCase().includes(name.toLowerCase()),
    )

    if (users.length === 0) {
      return null
    }

    if (!users) {
      return null
    }

    return users
  }

  async update(id: string, data: UserUpdateInput) {
    const indexOfUser = this.users.findIndex((user) => user.id === id)

    const userData = this.users[indexOfUser]

    const user = (this.users[indexOfUser] = {
      ...userData,
      ...data,
      updatedAt: new Date(),
    })

    return user
  }
}
