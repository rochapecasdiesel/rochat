import { InMemoryChatRepository } from '@/repositories/in-memory-repository/in-memory-chat-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { createMultipleUsers } from '../../utils/testUtilityFunctions'
import { DeleteMessageService } from './delete-message.service'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { PermissionDeniedError } from '../erros/permission-denied-error'
import { UserChat } from '@/@types/user'

let chatRepository: InMemoryChatRepository
let usersRepository: InMemoryUsersRepository
let sut: DeleteMessageService

describe('Delete Message Service', () => {
  beforeEach(async () => {
    chatRepository = new InMemoryChatRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteMessageService(chatRepository, usersRepository)

    // Cria dois usuários para os testes
    await createMultipleUsers(usersRepository, 2)
  })

  it('should be able to delete a message', async () => {
    // Cria um chat para os testes
    const chatResponse = await chatRepository.create({
      assingnedUser: 'User1',
      participants: ['100002', '100001'],
      status: 'assigned',
    })

    // Cria uma mensagem para o teste
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

    const userChat = {
      assignedUser: 'assigned',
      chatId: chatResponse.id,
      lastMessage: 'Hello World!!',
      lastTimestamp: new Date(),
      participantId: ['100002', '100001'],
    } as UserChat

    await usersRepository.createUserChat('100002', userChat)
    await usersRepository.createUserChat('100001', userChat)

    // Executa o serviço de exclusão de mensagem
    const { message } = await sut.execute({
      chatId: chatResponse.id,
      messageId: messageResponse.id,
      userId: '100001',
    })

    const sender = await usersRepository.findUserChatByChatId(
      '100001',
      chatResponse.id,
    )

    const receiver = await usersRepository.findUserChatByChatId(
      '100002',
      chatResponse.id,
    )

    // Verifica se a mensagem foi marcada como deletada
    expect(message.deleted).toEqual(true)
    expect(message.alterations).toHaveLength(1)
    expect(message.alterations?.[0].originalMessage).toEqual('Hello World!!')

    expect(sender).toEqual(
      expect.objectContaining({
        chatId: chatResponse.id,
        lastMessage: 'message deleted',
        lastTimestamp: message.createAt,
      }),
    )

    expect(receiver).toEqual(
      expect.objectContaining({
        chatId: chatResponse.id,
        lastMessage: 'message deleted',
        lastTimestamp: message.createAt,
      }),
    )
  })

  it('should throw an error if the chat does not exist', async () => {
    // Tentativa de excluir mensagem de um chat inexistente
    await expect(
      sut.execute({
        chatId: 'non-existent-chat-id',
        messageId: 'message-id',
        userId: '100001',
      }),
    ).rejects.toThrow(ResourceNotFoundError)
  })

  it('should throw an error if the user does not have permission to delete the message', async () => {
    // Cria um chat e uma mensagem
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

    // Tenta deletar a mensagem com um usuário que não é o remetente
    await expect(
      sut.execute({
        chatId: chatResponse.id,
        messageId: messageResponse.id,
        userId: '100002', // usuário diferente do remetente
      }),
    ).rejects.toThrow(PermissionDeniedError)
  })

  it('should log an alteration when a message is deleted', async () => {
    // Cria um chat e uma mensagem
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
        text: 'Message to be deleted',
      },
    )

    // Executa a exclusão da mensagem
    const { message } = await sut.execute({
      chatId: chatResponse.id,
      messageId: messageResponse.id,
      userId: '100001',
    })

    // Verifica se a alteração foi registrada
    expect(message.alterations).toHaveLength(1)
    expect(message.alterations?.[0].originalMessage).toEqual(
      'Message to be deleted',
    )
    expect(message.alterations?.[0].timestamp).toBeInstanceOf(Date)
  })
})
