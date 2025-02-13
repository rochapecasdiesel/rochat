// get-user-notifications.e2e.spec.ts
import { app } from '@/app'
import { clearFireStore } from '@/utils/clearFireStore'
import { generateFakeJwt } from '@/utils/generate-fake-jwt'
import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('GET /notification/:userId', () => {
  const userId = 'userGetNotification'
  let token: string

  beforeAll(async () => {
    await app.ready()
    await clearFireStore()
    token = generateFakeJwt({ sub: userId })

    // Cria o usuário
    await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userName: 'User Get Notification',
        userMessage: 'Test message',
        avatarUrl: 'http://example.com/avatar.png',
      })

    // Cria uma notificação para o usuário
    const notificationPayload = {
      type: 'chat',
      title: 'Test Notification',
      message: 'This is a test notification',
      timestamp: new Date().toISOString(),
      seen: false,
      details: { chatId: 'chatGet', messageId: 'msgGet' },
    }

    await request(app.server)
      .post(`/users/${userId}/notification`)
      .set('Authorization', `Bearer ${token}`)
      .send(notificationPayload)
  })

  afterAll(async () => {
    await app.close()
    await clearFireStore()
  })

  it('should get all notifications for the user', async () => {
    const response = await request(app.server)
      .get(`/users/${userId}/notification`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.data.notifications)).toBe(true)
    expect(response.body.data.notifications.length).toBeGreaterThanOrEqual(1)
  })
})
