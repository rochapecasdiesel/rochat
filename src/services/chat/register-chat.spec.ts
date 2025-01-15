import { InMemoryChatRepository } from '@/repositories/in-memory-repository/in-memory-chat-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { CreateChatService } from './register-chat.service'
import { ChatAlreadyExist } from '../erros/chat-already-exist-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'

let chatRepository: InMemoryChatRepository
let usersRepository: InMemoryUsersRepository
let sut: CreateChatService

describe('Register chat Service', () => {
  beforeEach(async () => {
    chatRepository = new InMemoryChatRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateChatService(chatRepository, usersRepository)
    await usersRepository.create({
      id: '000075',
      userName: 'John Doe',
      avatarUrl: 'http://example.com/avatar.jpg',
      userMessage: 'Hello, world!',
    })

    await usersRepository.create({
      id: '000076',
      userName: 'Jane Doe',
      avatarUrl: 'http://example.com/avatar.jpg',
      userMessage: 'Hello, world!',
    })
  })

  it('should be able to register a new chat', async () => {
    const { chat } = await sut.execute({
      assingnedUser: 'John Doe',
      participants: ['000075', '000076'],
      status: 'open',
    })

    expect(chat.participants).toHaveLength(2)
  })

  it('should not be able to register a chat that already exists', async () => {
    await sut.execute({
      assingnedUser: 'John Doe',
      participants: ['000075', '000076'],
      status: 'open',
    })

    await expect(() =>
      sut.execute({
        assingnedUser: 'John Doe',
        participants: ['000075', '000076'],
        status: 'open',
      }),
    ).rejects.toBeInstanceOf(ChatAlreadyExist)
  })

  it('should not be able to register a chat whit someone that doesnt exists', async () => {
    await expect(() =>
      sut.execute({
        assingnedUser: 'John Doe',
        participants: ['000075', '000077'],
        status: 'open',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
