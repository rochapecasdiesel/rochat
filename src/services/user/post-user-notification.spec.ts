// post-user-notification.service.spec.ts
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { PostUserNotificationService } from './post-user-notification.service'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { UserNotification } from '@/@types/user'

describe('Post User Notification Service', () => {
  let userRepository: InMemoryUsersRepository
  let postUserNotificationService: PostUserNotificationService
  const userId = 'user123'

  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    postUserNotificationService = new PostUserNotificationService(
      userRepository,
    )
    // Cria o usuário para associar as notificações
    await userRepository.create({
      id: userId,
      userName: 'Test User',
      userMessage: 'Hello',
      avatarUrl: 'http://example.com/avatar.png',
    })
  })

  it('should create a notification for a user', async () => {
    const notificationInput: UserNotification = {
      type: 'chat',
      title: 'Test Notification',
      message: 'This is a test notification',
      timestamp: new Date(),
      seen: false,
      details: { chatId: 'chat123', messageId: 'msg123' },
      notificationId: '',
      createdAt: new Date(),
    }

    const { notification } = await postUserNotificationService.execute(
      userId,
      notificationInput,
    )
    expect(notification).toHaveProperty('notificationId')
    expect(notification).toHaveProperty('createdAt')
    expect(notification.seen).toBe(false)
  })

  it('should throw an error if the user does not exist', async () => {
    const notificationInput: UserNotification = {
      type: 'chat',
      title: 'Test Notification',
      message: 'This is a test notification',
      timestamp: new Date(),
      createdAt: new Date(),
      seen: false,
      details: { chatId: 'chat123', messageId: 'msg123' },
      notificationId: '',
    }

    await expect(
      postUserNotificationService.execute(
        'non-existent-user',
        notificationInput,
      ),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
