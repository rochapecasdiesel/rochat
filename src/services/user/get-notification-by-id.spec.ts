// get-notification-by-id.service.spec.ts
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { PostUserNotificationService } from './post-user-notification.service'
import { GetNotificationByIdService } from './get-notification-by-Id.service'

describe('GetNotificationByIdService', () => {
  let userRepository: InMemoryUsersRepository
  let postUserNotificationService: PostUserNotificationService
  let getNotificationByIdService: GetNotificationByIdService
  const userId = 'user123'
  let notificationId: string

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    postUserNotificationService = new PostUserNotificationService(
      userRepository,
    )
    getNotificationByIdService = new GetNotificationByIdService(userRepository)
    // Cria o usuário
    await userRepository.create({
      id: userId,
      userName: 'Test User',
      userMessage: 'Hello',
      avatarUrl: 'http://example.com/avatar.png',
    })
    // Cria uma notificação e armazena o notificationId
    const { notification } = await postUserNotificationService.execute(userId, {
      type: 'generics',
      title: 'Get By ID Notification',
      message: 'Test get by id',
      timestamp: new Date(),
      seen: false,
      details: { chatId: 'chatX', messageId: 'msgX' },
      notificationId: '',
      createdAt: new Date(),
    })
    notificationId = notification.notificationId
  })

  it('should return the notification by its id', async () => {
    const { notification } = await getNotificationByIdService.execute(
      userId,
      notificationId,
    )
    expect(notification).not.toBeNull()
    expect(notification?.notificationId).toBe(notificationId)
  })

  it('should return null if the notification does not exist', async () => {
    const { notification } = await getNotificationByIdService.execute(
      userId,
      'non-existent-id',
    )
    expect(notification).toBeNull()
  })
})
