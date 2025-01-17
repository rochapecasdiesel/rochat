import { User, UserChat, UserCreateInput, UserUpdateInput } from '@/@types/user'
import { UpdateUserChat, UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

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
      return []
    }

    if (!users) {
      return []
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

  async createUserChat(userId: string, data: UserChat): Promise<UserChat> {
    const userIndex = this.users.findIndex((user) => user.id === userId)

    const userChat = {
      ...data,
      id: randomUUID(),
    }

    if (userIndex > -1) {
      if (!Array.isArray(this.users[userIndex].userChats)) {
        this.users[userIndex].userChats = [userChat]
      }

      this.users[userIndex].userChats.push(userChat)
    }

    return userChat
  }

  async updateUserChat(data: UpdateUserChat): Promise<UserChat> {
    const { userId, userChatId, ...updateData } = data

    // Localizar o índice do usuário
    const userIndex = this.users.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      throw new Error(`User with ID ${userId} not found.`)
    }

    const user = this.users[userIndex]

    // Garantir que `userChats` existe
    if (!user.userChats) {
      throw new Error(`No chats found for user with ID ${userId}.`)
    }

    // Localizar o índice do chat
    const userChatIndex = user.userChats.findIndex(
      (chat) => chat.id === userChatId,
    )

    if (userChatIndex === -1) {
      throw new Error(`Chat with ID ${userChatId} not found.`)
    }

    // Atualizar o chat com os novos dados
    const updatedChat = {
      ...user.userChats[userChatIndex],
      ...updateData.data,
    }

    user.userChats[userChatIndex] = updatedChat

    return updatedChat
  }

  async findUserChatById(
    userId: string,
    userChatId: string,
  ): Promise<UserChat | null> {
    // Localizar o usuário pelo ID
    const user = this.users.find((user) => user.id === userId)

    // Verificar se o usuário existe
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`)
    }

    // Verificar se o usuário possui chats
    if (!user.userChats) {
      return null
    }

    // Localizar o chat específico pelo ID
    const userChat = user.userChats.find((chat) => chat.id === userChatId)

    // Retornar o chat encontrado ou null se não existir
    return userChat || null
  }

  async getUserChats(userId: string, page: number): Promise<UserChat[]> {
    // Localizar o usuário pelo ID
    const user = this.users.find((user) => user.id === userId)

    // Verificar se o usuário existe
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`)
    }

    // Verificar se o usuário possui chats
    if (!user.userChats || user.userChats.length === 0) {
      return []
    }

    // Definir a quantidade de itens por página
    const itemsPerPage = 50

    // Calcular o índice inicial e final para a paginação
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    // Retornar os itens paginados
    return user.userChats.slice(startIndex, endIndex)
  }

  async findUserChatByChatId(
    userId: string,
    chatId: string,
  ): Promise<UserChat | null> {
    const user = this.users.find((user) => user.id === userId)

    if (!user) {
      return null
    }

    return (
      user.userChats?.find((userchats) => userchats.chatId === chatId) ?? null
    )
  }
}
