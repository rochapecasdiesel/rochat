import { InMemoryChatRepository } from '@/repositories/in-memory-repository/in-memory-chat-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { createMultipleUsers } from '../../utils/testUtilityFunctions'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { GetChatByIdService } from './get-chat-by-id.service'

let chatRepository: InMemoryChatRepository
let usersRepository: InMemoryUsersRepository
let sut: GetChatByIdService

describe('Get Chat Service', () => {
  beforeEach(async () => {
    chatRepository = new InMemoryChatRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new GetChatByIdService(chatRepository)

    // Criar múltiplos usuários para os testes
    createMultipleUsers(usersRepository, 2)
  })

  it('should be able to get chat by id', async () => {
    // Arrange
    const chatResponse = await chatRepository.create({
      assingnedUser: 'User1',
      participants: ['100002', '100001'],
      status: 'open',
    })

    // Act
    const { chat } = await sut.execute({
      chatId: chatResponse.id,
    })

    // Assert
    expect(chat).toEqual(
      expect.objectContaining({
        assingnedUser: 'User1',
      }),
    )
  })

  it('should throw error for invalid chat ID', async () => {
    // Act & Assert
    await expect(
      sut.execute({
        chatId: 'invalid-chat-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
