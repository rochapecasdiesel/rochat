import { InMemoryChatRepository } from '@/repositories/in-memory-repository/in-memory-chat-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { CreateChatService } from './register-chat.service'
import { ChatAlreadyExist } from '../erros/chat-already-exist-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { ParticipantsWithSameId } from '../erros/participants-with-same-id'
import { createMultipleUsers } from '@/utils/testUtilityFunctions'

let chatRepository: InMemoryChatRepository
let usersRepository: InMemoryUsersRepository
let sut: CreateChatService

describe('Register chat Service', () => {
  beforeEach(async () => {
    chatRepository = new InMemoryChatRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateChatService(chatRepository, usersRepository)

    createMultipleUsers(usersRepository, 2)
  })

  it('should be able to register a new chat', async () => {
    const { chat } = await sut.execute({
      assingnedUser: 'John Doe',
      participants: ['100001', '100002'],
      status: 'open',
    })

    const userResponse = await usersRepository.findById('100001')

    expect(chat.participants).toHaveLength(2)

    expect(userResponse?.userChats).toEqual([
      expect.objectContaining({
        participantId: ['100001', '100002'],
      }),
    ])
  })

  it('should not be able to register a chat that some user does not exist', async () => {
    await expect(() =>
      sut.execute({
        assingnedUser: 'John Doe',
        participants: ['100001', '000077'],
        status: 'open',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to register a chat with participants having the same ID', async () => {
    await expect(() =>
      sut.execute({
        assingnedUser: 'John Doe',
        participants: ['100001', '100001'],
        status: 'open',
      }),
    ).rejects.toBeInstanceOf(ParticipantsWithSameId)
  })

  it('should not be able to register a chat that already exists', async () => {
    await sut.execute({
      assingnedUser: 'John Doe',
      participants: ['100001', '100002'],
      status: 'open',
    })

    await expect(() =>
      sut.execute({
        assingnedUser: 'John Doe',
        participants: ['100001', '100002'],
        status: 'open',
      }),
    ).rejects.toBeInstanceOf(ChatAlreadyExist)
  })

  it('should not be able to register a chat whit someone that doesnt exists', async () => {
    await expect(() =>
      sut.execute({
        assingnedUser: 'John Doe',
        participants: ['100001', '000077'],
        status: 'open',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
