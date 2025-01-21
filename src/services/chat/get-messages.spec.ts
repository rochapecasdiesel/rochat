import { InMemoryChatRepository } from '@/repositories/in-memory-repository/in-memory-chat-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { createMultipleUsers } from '../../utils/testUtilityFunctions'
import { GetMessagesService } from './get-messages.service'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'

let chatRepository: InMemoryChatRepository
let usersRepository: InMemoryUsersRepository
let sut: GetMessagesService

// Função utilitária para criar mensagens no chat
async function createMessages(chatId: string, count: number) {
  for (let i = 0; i < count; i++) {
    await chatRepository.createMessagem(chatId, {
      altered: false,
      deleted: false,
      recieverId: '100002',
      senderId: '100001',
      source: 'internal',
      text: `${i} - Hello World!!`,
    })
  }
}

describe('Get Messages Service', () => {
  beforeEach(async () => {
    chatRepository = new InMemoryChatRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new GetMessagesService(chatRepository)

    // Criar múltiplos usuários para os testes
    createMultipleUsers(usersRepository, 2)
  })

  it('should be able to list messages (first page)', async () => {
    // Arrange
    const chatResponse = await chatRepository.create({
      assingnedUser: 'User1',
      participants: ['100002', '100001'],
      status: 'open',
    })
    await createMessages(chatResponse.id, 60)

    // Act
    const { messages } = await sut.execute({
      chatId: chatResponse.id,
      page: 1,
    })

    // Assert
    expect(messages).toHaveLength(50) // Primeira página deve conter 50 mensagens
    expect(messages[49]).toEqual(
      expect.objectContaining({
        text: '49 - Hello World!!',
      }),
    )
  })

  it('should be able to paginate messages (second page)', async () => {
    // Arrange
    const chatResponse = await chatRepository.create({
      assingnedUser: 'User1',
      participants: ['100002', '100001'],
      status: 'open',
    })
    await createMessages(chatResponse.id, 60)

    // Act
    const { messages } = await sut.execute({
      chatId: chatResponse.id,
      page: 2,
    })

    // Assert
    expect(messages).toHaveLength(10) // Segunda página deve conter apenas 10 mensagens
    expect(messages[9]).toEqual(
      expect.objectContaining({
        text: '59 - Hello World!!',
      }),
    )
  })

  it('should return empty array if no messages exist', async () => {
    // Arrange
    const chatResponse = await chatRepository.create({
      assingnedUser: 'User1',
      participants: ['100002', '100001'],
      status: 'open',
    })

    // Act
    const { messages } = await sut.execute({
      chatId: chatResponse.id,
      page: 1,
    })

    // Assert
    expect(messages).toHaveLength(0) // Nenhuma mensagem deve ser retornada
  })

  it('should return empty array for non-existent pages', async () => {
    // Arrange
    const chatResponse = await chatRepository.create({
      assingnedUser: 'User1',
      participants: ['100002', '100001'],
      status: 'open',
    })
    await createMessages(chatResponse.id, 20)

    // Act
    const { messages } = await sut.execute({
      chatId: chatResponse.id,
      page: 3, // Página além do limite de mensagens
    })

    // Assert
    expect(messages).toHaveLength(0) // Nenhuma mensagem deve ser retornada
  })

  it('should throw error for invalid chat ID', async () => {
    // Act & Assert
    await expect(
      sut.execute({
        chatId: 'invalid-chat-id',
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
