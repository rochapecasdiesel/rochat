// get-user-notifications.service.spec.ts
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { PostUserNotificationService } from './post-user-notification.service'
import { GetUserNotificationsService } from './get-user-notifications.service'
import { UserNotification } from '@/@types/user'

describe('GetUserNotificationsService', () => {
  let userRepository: InMemoryUsersRepository
  let postUserNotificationService: PostUserNotificationService
  let getUserNotificationsService: GetUserNotificationsService
  const userId = 'user123'

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    postUserNotificationService = new PostUserNotificationService(
      userRepository,
    )
    getUserNotificationsService = new GetUserNotificationsService(
      userRepository,
    )
    // Cria o usuário
    await userRepository.create({
      id: userId,
      userName: 'Test User',
      userMessage: 'Hello',
      avatarUrl: 'http://example.com/avatar.png',
    })
    // Cria duas notificações
    const notif1: UserNotification = {
      type: 'chat',
      title: 'Notification 1',
      message: 'Message 1',
      timestamp: new Date(),
      createdAt: new Date(),
      seen: false,
      details: { chatId: 'chat1', messageId: 'msg1' },
      notificationId: '',
    }
    const notif2: UserNotification = {
      type: 'order',
      title: 'Notification 2',
      message: 'Message 2',
      timestamp: new Date(),
      createdAt: new Date(),
      seen: false,
      details: { chatId: 'chat2', messageId: 'msg2' },
      notificationId: '',
    }
    await postUserNotificationService.execute(userId, notif1)
    await postUserNotificationService.execute(userId, notif2)
  })

  it('should return all notifications for the user', async () => {
    const { notifications } = await getUserNotificationsService.execute(userId)
    expect(notifications.length).toBe(2)
  })
})
