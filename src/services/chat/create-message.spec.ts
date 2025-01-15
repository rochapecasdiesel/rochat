import { InMemoryChatRepository } from '@/repositories/in-memory-repository/in-memory-chat-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { CreateMessageService } from './create-message.service'
import { createMultipleUsers } from './testUtilityFunctions'

let chatRepository: InMemoryChatRepository
let usersRepository: InMemoryUsersRepository
let sut: CreateMessageService

describe('Create Message Service', () => {
  beforeEach(async () => {
    chatRepository = new InMemoryChatRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateMessageService(chatRepository, usersRepository)

    createMultipleUsers(usersRepository, 2)
  })

  it('should be able to create a new message', async () => {
    const chatResponse = await chatRepository.create({
      assingnedUser: 'User1',
      participants: ['100002', '100001'],
      status: 'open',
    })

    const { message } = await sut.execute({
      chatId: chatResponse.id,
      altered: false,
      deleted: false,
      recieverId: '100002',
      senderId: '100001',
      source: 'internal',
      text: 'Hello World!!',
    })

    const userResponse = await usersRepository.findById('100001')

    expect(message.id).toEqual(expect.any(String))

    expect(message).toEqual(
      expect.objectContaining({
        senderId: '100001',
        recieverId: '100002',
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
