// mark-notification-as-seen.service.spec.ts
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { PostUserNotificationService } from './post-user-notification.service'
import { MarkNotificationAsSeenService } from './mark-notificatio-as-seen.service'

describe('MarkNotificationAsSeenService', () => {
  let userRepository: InMemoryUsersRepository
  let postUserNotificationService: PostUserNotificationService
  let markNotificationAsSeenService: MarkNotificationAsSeenService
  const userId = 'user123'
  let notificationId: string

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    postUserNotificationService = new PostUserNotificationService(
      userRepository,
    )
    markNotificationAsSeenService = new MarkNotificationAsSeenService(
      userRepository,
    )
    // Cria o usuário
    await userRepository.create({
      id: userId,
      userName: 'Test User',
      userMessage: 'Hello',
      avatarUrl: 'http://example.com/avatar.png',
    })
    // Cria uma notificação que será marcada como vista
    const { notification } = await postUserNotificationService.execute(userId, {
      type: 'chat',
      title: 'Notification to be marked seen',
      message: 'Mark me as seen',
      timestamp: new Date(),
      seen: false,
      details: { chatId: 'chatMark', messageId: 'msgMark' },
      notificationId: '',
      createdAt: new Date(),
    })
    notificationId = notification.notificationId
  })

  it('should mark the notification as seen', async () => {
    const seenAt = new Date()
    const { notification } = await markNotificationAsSeenService.execute(
      userId,
      notificationId,
      seenAt,
    )
    expect(notification.seen).toBe(true)
    expect(notification.seenAt).toEqual(seenAt)
  })
})
