// mark-notification-as-seen.e2e.spec.ts
import { app } from '@/app'
import { clearFireStore } from '@/utils/clearFireStore'
import { generateFakeJwt } from '@/utils/generate-fake-jwt'
import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('PATCH /notification/:userId/:notificationId/seen', () => {
  const userId = 'userMarkSeenTest'
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
        userName: 'User Mark Seen Test',
        userMessage: 'Test message',
        avatarUrl: 'http://example.com/avatar.png',
      })

    // Cria uma notificação para ser marcada como vista
    const notificationPayload = {
      type: 'chat',
      title: 'Mark as Seen Test',
      message: 'Notification to be marked as seen',
      timestamp: new Date().toISOString(),
      seen: false,
      details: { chatId: 'chatMark', messageId: 'msgMark' },
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

  it('should mark a notification as seen', async () => {
    const seenAt = new Date().toISOString()
    const response = await request(app.server)
      .patch(`/users/notification/${userId}/${notificationId}/seen`)
      .set('Authorization', `Bearer ${token}`)
      .send({ seenAt })

    expect(response.statusCode).toBe(200)
    expect(response.body.data.notification.seen).toBe(true)
    expect(response.body.data.notification.seenAt).toBeTruthy()
  })
})
