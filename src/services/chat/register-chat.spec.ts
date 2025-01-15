import { InMemoryChatRepository } from '@/repositories/in-memory-repository/in-memory-chat-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { CreateChatService } from './register-chat.service'
import { ChatAlreadyExist } from '../erros/chat-already-exist-error'

let chatRepository: InMemoryChatRepository
let sut: CreateChatService

describe('Register chat Service', () => {
  beforeEach(() => {
    chatRepository = new InMemoryChatRepository()
    sut = new CreateChatService(chatRepository)
  })

  it('should be able to register a new chat', async () => {
    const { chat } = await sut.execute({
      assingnedUser: 'John Doe',
      participants: ['John Doe', 'Jane Doe'],
      status: 'open',
    })

    expect(chat.participants).toHaveLength(2)
  })

  it('should not be able to register a chat that already exists', async () => {
    await sut.execute({
      assingnedUser: 'John Doe',
      participants: ['John Doe', 'Jane Doe'],
      status: 'open',
    })

    await expect(() =>
      sut.execute({
        assingnedUser: 'John Doe',
        participants: ['John Doe', 'Jane Doe'],
        status: 'open',
      }),
    ).rejects.toBeInstanceOf(ChatAlreadyExist)
  })
})
