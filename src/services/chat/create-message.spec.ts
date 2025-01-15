import { InMemoryChatRepository } from '@/repositories/in-memory-repository/in-memory-chat-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { CreateMessageService } from './create-message.service'

let chatRepository: InMemoryChatRepository
let usersRepository: InMemoryUsersRepository
let sut: CreateMessageService

describe('Create Message Service', () => {
  beforeEach(async () => {
    chatRepository = new InMemoryChatRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateMessageService(chatRepository, usersRepository)

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

  it('should be able to create a new message', async () => {
    const chatResponse = await chatRepository.create({
      assingnedUser: 'John Doe',
      participants: ['000075', '000076'],
      status: 'open',
    })

    const { message } = await sut.execute({
      chatId: chatResponse.id,
      altered: false,
      deleted: false,
      recieverId: '000075',
      senderId: '000076',
      source: 'internal',
      text: 'Hello World!!',
    })

    const userResponse = await usersRepository.findById('000075')

    expect(message.id).toEqual(expect.any(String))

    expect(message).toEqual(
      expect.objectContaining({
        senderId: '000076',
        recieverId: '000075',
      }),
    )

    expect(userResponse?.userChats).toEqual([
      expect.objectContaining({
        chatId: chatResponse.id,
        lastMessage: message.text,
      }),
    ])
  })
})
