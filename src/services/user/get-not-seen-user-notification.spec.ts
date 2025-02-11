// get-not-seen-user-notification.service.spec.ts
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { PostUserNotificationService } from './post-user-notification.service'
import { GetNotSeenUserNotificationService } from './get-not-seen-user-notification.service'
import { UserNotification } from '@/@types/user'

describe('GetNotSeenUserNotificationService', () => {
  let userRepository: InMemoryUsersRepository
  let postUserNotificationService: PostUserNotificationService
  let getNotSeenUserNotificationService: GetNotSeenUserNotificationService
  const userId = 'user123'

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    postUserNotificationService = new PostUserNotificationService(
      userRepository,
    )
    getNotSeenUserNotificationService = new GetNotSeenUserNotificationService(
      userRepository,
    )
    // Cria o usuário
    await userRepository.create({
      id: userId,
      userName: 'Test User',
      userMessage: 'Hello',
      avatarUrl: 'http://example.com/avatar.png',
    })
    // Cria uma notificação não vista
    const notifNotSeen: UserNotification = {
      type: 'chat',
      title: 'Not Seen Notification',
      message: 'This notification is not seen',
      timestamp: new Date(),
      seen: false,
      details: { chatId: 'chat1', messageId: 'msg1' },
      notificationId: '',
      createdAt: new Date(),
    }
    // Cria uma notificação já vista
    const notifSeen: UserNotification = {
      type: 'order',
      title: 'Seen Notification',
      message: 'This notification is seen',
      timestamp: new Date(),
      seen: true,
      details: { chatId: 'chat2', messageId: 'msg2' },
      createdAt: new Date(),
      notificationId: '',
    }
    await postUserNotificationService.execute(userId, notifNotSeen)
    await postUserNotificationService.execute(userId, notifSeen)
  })

  it('should return only notifications that are not seen', async () => {
    const { notifications } =
      await getNotSeenUserNotificationService.execute(userId)
    expect(notifications.length).toBe(1)
    expect(notifications[0].seen).toBe(false)
  })
})
