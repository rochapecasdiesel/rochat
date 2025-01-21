import { InMemoryChatRepository } from '@/repositories/in-memory-repository/in-memory-chat-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { CreateMessageService } from './create-message.service'
import { createMultipleUsers } from '../../utils/testUtilityFunctions'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { UserChat } from '@/@types/user'

let chatRepository: InMemoryChatRepository
let usersRepository: InMemoryUsersRepository
let sut: CreateMessageService

describe('Create Message Service', () => {
  beforeEach(async () => {
    chatRepository = new InMemoryChatRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateMessageService(chatRepository, usersRepository)

    // Cria dois usuários para os testes
    await createMultipleUsers(usersRepository, 2)
  })

  it('should be able to create a new message', async () => {
    // Cria um chat para os testes
    const chatResponse = await chatRepository.create({
      assingnedUser: 'User1',
      participants: ['100002', '100001'],
      status: 'open',
    })

    const userChat = {
      assignedUser: 'assigned',
      chatId: chatResponse.id,
      lastMessage: '',
      lastTimestamp: new Date(),
      participantId: ['100002', '100001'],
    } as UserChat

    await usersRepository.createUserChat('100002', userChat)
    await usersRepository.createUserChat('100001', userChat)

    // Executa o serviço para criar uma mensagem
    const { message } = await sut.execute({
      chatId: chatResponse.id,
      altered: false,
      deleted: false,
      senderId: '100001',
      source: 'internal',
      text: 'Hello World!!',
    })

    // Verifica se a mensagem foi criada corretamente
    expect(message).toEqual(
      expect.objectContaining({
        senderId: '100001',
        text: 'Hello World!!',
        altered: false,
        deleted: false,
      }),
    )

    // Verifica se os chats dos participantes foram atualizados corretamente
    const sender = await usersRepository.findUserChatByChatId(
      '100001',
      chatResponse.id,
    )

    const receiver = await usersRepository.findUserChatByChatId(
      '100002',
      chatResponse.id,
    )

    expect(sender).toEqual(
      expect.objectContaining({
        chatId: chatResponse.id,
        lastMessage: message.text,
        lastTimestamp: message.createAt,
      }),
    )

    expect(receiver).toEqual(
      expect.objectContaining({
        chatId: chatResponse.id,
        lastMessage: message.text,
        lastTimestamp: message.createAt,
      }),
    )
  })

  it('should throw an error if the chat does not exist', async () => {
    await expect(
      sut.execute({
        chatId: 'nonexistent-chat-id',
        altered: false,
        deleted: false,
        senderId: '100001',
        source: 'internal',
        text: 'This will fail',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
