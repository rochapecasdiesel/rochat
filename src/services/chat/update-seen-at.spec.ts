import { InMemoryChatRepository } from '@/repositories/in-memory-repository/in-memory-chat-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { createMultipleUsers } from '../../utils/testUtilityFunctions'
import { UpdateSeenMessageService } from './update-seen-at.service'
import { Timestamp } from 'firebase-admin/firestore'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { PermissionDeniedError } from '../erros/permission-denied-error'

let chatRepository: InMemoryChatRepository
let usersRepository: InMemoryUsersRepository
let sut: UpdateSeenMessageService

describe('Update Seen at Service', () => {
  beforeEach(async () => {
    chatRepository = new InMemoryChatRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateSeenMessageService(chatRepository)

    // Cria dois usuários para os testes
    await createMultipleUsers(usersRepository, 2)
  })

  it('should be able to update seen at', async () => {
    const chatResponse = await chatRepository.create({
      assingnedUser: 'User1',
      participants: ['100002', '100001'],
      status: 'open',
    })

    const messageResponse = await chatRepository.createMessagem(
      chatResponse.id,
      {
        altered: false,
        deleted: false,
        senderId: '100001',
        source: 'internal',
        text: 'Hello World!!',
      },
    )

    const { chat } = await sut.execute({
      chatId: chatResponse.id,
      messagesId: [messageResponse.id],
      userId: '100002',
    })

    expect(chat.lastSeenAt).toBeInstanceOf(Timestamp)
  })

  it('should not be able to update seen at, with invalid chat id', async () => {
    const chatResponse = await chatRepository.create({
      assingnedUser: 'User1',
      participants: ['100002', '100001'],
      status: 'open',
    })

    const messageResponse = await chatRepository.createMessagem(
      chatResponse.id,
      {
        altered: false,
        deleted: false,
        senderId: '100001',
        source: 'internal',
        text: 'Hello World!!',
      },
    )

    await expect(
      sut.execute({
        chatId: 'sedeh',
        messagesId: [messageResponse.id],
        userId: '100002',
      }),
    ).rejects.toThrow(ResourceNotFoundError)
  })

  it('should not be able to update seen at, with message Id does not exists', async () => {
    const chatResponse = await chatRepository.create({
      assingnedUser: 'User1',
      participants: ['100002', '100001'],
      status: 'open',
    })

    await chatRepository.createMessagem(chatResponse.id, {
      altered: false,
      deleted: false,
      senderId: '100001',
      source: 'internal',
      text: 'Hello World!!',
    })

    await expect(
      sut.execute({
        chatId: chatResponse.id,
        messagesId: ['qwdqwd'],
        userId: '100002',
      }),
    ).rejects.toThrow(ResourceNotFoundError)
  })

  it('should not be able to update seen at, with user Id same sender id', async () => {
    const chatResponse = await chatRepository.create({
      assingnedUser: 'User1',
      participants: ['100002', '100001'],
      status: 'open',
    })

    const messageResponse = await chatRepository.createMessagem(
      chatResponse.id,
      {
        altered: false,
        deleted: false,
        senderId: '100001',
        source: 'internal',
        text: 'Hello World!!',
      },
    )

    await expect(
      sut.execute({
        chatId: chatResponse.id,
        messagesId: [messageResponse.id],
        userId: '100001',
      }),
    ).rejects.toThrow(PermissionDeniedError)
  })
})
