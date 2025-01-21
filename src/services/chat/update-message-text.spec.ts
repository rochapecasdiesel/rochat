import { InMemoryChatRepository } from '@/repositories/in-memory-repository/in-memory-chat-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { createMultipleUsers } from '../../utils/testUtilityFunctions'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { PermissionDeniedError } from '../erros/permission-denied-error'
import { UpdateMessageTextService } from './update-message-text.service'

let chatRepository: InMemoryChatRepository
let usersRepository: InMemoryUsersRepository
let sut: UpdateMessageTextService

describe('Update Message Text Service', () => {
  beforeEach(async () => {
    chatRepository = new InMemoryChatRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateMessageTextService(chatRepository, usersRepository)

    // Cria dois usuários para os testes
    await createMultipleUsers(usersRepository, 2)
  })

  it('should be able to update a message text', async () => {
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
        recieverId: '100002',
        senderId: '100001',
        source: 'internal',
        text: 'Hello World!!',
      },
    )

    const { message } = await sut.execute({
      chatId: chatResponse.id,
      messageId: messageResponse.id,
      userId: '100001',
      text: 'Updated',
    })

    expect(message.text).toEqual('Updated')
    expect(message.alterations).toHaveLength(1)
    expect(message.alterations?.[0].originalMessage).toEqual('Hello World!!')
    expect(message.alterations?.[0].timestamp).toBeInstanceOf(Date)
  })

  it('should throw an error if the chat does not exist', async () => {
    await expect(
      sut.execute({
        chatId: 'non-existent-chat-id',
        messageId: 'message-id',
        userId: '100001',
        text: 'Updated',
      }),
    ).rejects.toThrow(ResourceNotFoundError)
  })

  it('should throw an error if the user does not have permission to update the message', async () => {
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
        recieverId: '100002',
        senderId: '100001',
        source: 'internal',
        text: 'Hello World!!',
      },
    )

    await expect(
      sut.execute({
        chatId: chatResponse.id,
        messageId: messageResponse.id,
        userId: '100002', // usuário não é o remetente
        text: 'Updated',
      }),
    ).rejects.toThrow(PermissionDeniedError)
  })

  it('should log an alteration when a message is updated', async () => {
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
        recieverId: '100002',
        senderId: '100001',
        source: 'internal',
        text: 'Hello World!!',
      },
    )

    const { message } = await sut.execute({
      chatId: chatResponse.id,
      messageId: messageResponse.id,
      userId: '100001',
      text: 'Updated',
    })

    expect(message.alterations).toHaveLength(1)
    expect(message.alterations?.[0].originalMessage).toEqual('Hello World!!')
    expect(message.alterations?.[0].timestamp).toBeInstanceOf(Date)
  })
})
