// post-user-notification.e2e.spec.ts
import { app } from '@/app'
import { clearFireStore } from '@/utils/clearFireStore'
import { generateFakeJwt } from '@/utils/generate-fake-jwt'
import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('POST /notification/:userId', () => {
  const userId = 'userPostTest'
  let token: string

  beforeAll(async () => {
    await app.ready()
    await clearFireStore()
    token = generateFakeJwt({ sub: userId })

    // Cria um usuário para associar as notificações
    await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userName: 'User Post Test',
        userMessage: 'Test message',
        avatarUrl: 'http://example.com/avatar.png',
      })
  })

  afterAll(async () => {
    await app.close()
    await clearFireStore()
  })

  it('should create a notification for a user', async () => {
    const notificationPayload = {
      type: 'chat',
      title: 'Notification Title',
      message: 'Notification message',
      timestamp: new Date().toISOString(),
      seen: false,
      details: {
        chatId: 'chat1',
        messageId: 'msg1',
      },
    }

    const response = await request(app.server)
      .post(`/users/${userId}/notification`)
      .set('Authorization', `Bearer ${token}`)
      .send(notificationPayload)

    expect(response.statusCode).toBe(201)
    expect(response.body.data.notification).toHaveProperty('notificationId')
    expect(response.body.data.notification).toHaveProperty('createdAt')
    expect(response.body.data.notification.seen).toBe(false)
  })
})
