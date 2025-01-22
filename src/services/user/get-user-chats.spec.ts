import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { GetUserChatsService } from './get-user-chats.service'
import { createMultipleUsers } from '../../utils/testUtilityFunctions'
import { randomUUID } from 'crypto'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserChatsService

async function createChatsForUser(
  repository: InMemoryUsersRepository,
  userId: string,
  count: number,
) {
  for (let i = 0; i < count; i++) {
    await repository.createUserChat(userId, {
      chatId: randomUUID(),
      assignedUser: `assigned`,
      lastMessage: `Hello from chat ${i + 1}`,
      lastTimestamp: new Date(),
      participantId: [userId, i + 1 < 10 ? `10000${i + 1}` : `1000${i + 1}`],
      id: randomUUID(),
    })
  }
}

describe('Get User Chats Service', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserChatsService(usersRepository)

    // Criar múltiplos usuários para os testes
    await createMultipleUsers(usersRepository, 50)
  })

  it('should list chats for the first page with a default limit of 50', async () => {
    // Criar 51 chats para o usuário "100001"
    await createChatsForUser(usersRepository, '100001', 51)

    const { userChats } = await sut.execute({ userId: '100001', page: 1 })

    expect(userChats).toHaveLength(50)
    expect(userChats[0]).toEqual(
      expect.objectContaining({
        lastMessage: 'Hello from chat 1',
      }),
    )
  })

  it('should return an empty list if the user has no chats', async () => {
    const { userChats } = await sut.execute({ userId: '100002', page: 1 })

    expect(userChats).toHaveLength(0)
  })

  it('should throw an error if the user does not exist', async () => {
    await expect(
      sut.execute({ userId: 'nonexistent-user', page: 1 }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
