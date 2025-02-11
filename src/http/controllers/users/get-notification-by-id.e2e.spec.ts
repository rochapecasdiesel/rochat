// get-notification-by-id.e2e.spec.ts
import { app } from '@/app'
import { clearFireStore } from '@/utils/clearFireStore'
import { generateFakeJwt } from '@/utils/generate-fake-jwt'
import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('GET /notification/:userId/:notificationId', () => {
  const userId = 'userByIdTest'
  let token: string
  let notificationId: string

  beforeAll(async () => {
    await app.ready()
    await clearFireStore()
    token = generateFakeJwt({ sub: userId })

    // Cria o usuário
    await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userName: 'User By Id Test',
        userMessage: 'Test message',
        avatarUrl: 'http://example.com/avatar.png',
      })

    // Cria uma notificação
    const notificationPayload = {
      type: 'generics',
      title: 'Get Notification By ID',
      message: 'Testing get by id',
      timestamp: new Date().toISOString(),
      seen: false,
      details: { chatId: 'chatById', messageId: 'msgById' },
    }

    const response = await request(app.server)
      .post(`/users/notification/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(notificationPayload)

    notificationId = response.body.data.notification.notificationId
  })

  afterAll(async () => {
    await app.close()
    await clearFireStore()
  })

  it('should get a notification by its id', async () => {
    const response = await request(app.server)
      .get(`/users/notification/${userId}/${notificationId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.data.notification.notificationId).toBe(notificationId)
  })
})
