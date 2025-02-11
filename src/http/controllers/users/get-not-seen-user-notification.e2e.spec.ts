// get-not-seen-user-notification.e2e.spec.ts
import { app } from '@/app'
import { clearFireStore } from '@/utils/clearFireStore'
import { generateFakeJwt } from '@/utils/generate-fake-jwt'
import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('GET /notification/:userId/not-seen', () => {
  const userId = 'userNotSeenTest'
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
        userName: 'User Not Seen Test',
        userMessage: 'Test message',
        avatarUrl: 'http://example.com/avatar.png',
      })

    // Cria uma notificação com seen false
    const notificationPayload = {
      type: 'order',
      title: 'Not Seen Notification',
      message: 'This notification is not seen yet',
      timestamp: new Date().toISOString(),
      seen: false,
      details: { chatId: 'chatNotSeen', messageId: 'msgNotSeen' },
    }

    await request(app.server)
      .post(`/users/notification/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(notificationPayload)
  })

  afterAll(async () => {
    await app.close()
    await clearFireStore()
  })

  it('should get only not seen notifications for the user', async () => {
    const response = await request(app.server)
      .get(`/users/notification/${userId}/not-seen`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.data.notifications)).toBe(true)
    response.body.data.notifications.forEach((notif: { seen: boolean }) => {
      expect(notif.seen).toBe(false)
    })
  })
})
