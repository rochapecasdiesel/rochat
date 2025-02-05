import { app } from '@/app'
import { clearFireStore } from '@/utils/clearFireStore'
import { generateFakeJwt } from '@/utils/generate-fake-jwt'

import request from 'supertest'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Delete Messages Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
    await clearFireStore()
  })

  afterAll(async () => {
    await app.close()
    await clearFireStore()
  })

  it('should be able to messages by chatId', async () => {
    const token1 = generateFakeJwt({ sub: '000075' })
    const token2 = generateFakeJwt({ sub: '000076' })

    await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        userName: 'John Doe',
        userMessage: 'test',
        avatarUrl: '123456',
      })

    await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        userName: 'Jane Doe',
        userMessage: 'test',
        avatarUrl: '123456',
      })

    const chatResponse = await request(app.server)
      .post('/chats')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        participants: ['000076'],
      })

    const messageResponse1 = await request(app.server)
      .post(`/chats/${chatResponse.body.data.chat.id}/message`)
      .set('Authorization', `Bearer ${token1}`)
      .send({
        source: 'internal',
        recieverId: '000076',
        text: 'Hwllo, John!',
      })

    const messageResponse2 = await request(app.server)
      .delete(
        `/chats/${chatResponse.body.data.chat.id}/message/${messageResponse1.body.data.message.id}`,
      )
      .set('Authorization', `Bearer ${token1}`)
      .send({
        userId: messageResponse1.body.data.message.userId,
      })

    const response = await request(app.server)
      .get(`/chats/${chatResponse.body.data.chat.id}/messages`)
      .set('Authorization', `Bearer ${token1}`)

    expect(messageResponse2.status).toBe(201)

    expect(response.body.data.messages).toEqual([
      expect.objectContaining({
        deleted: true,
      }),
    ])
  })
})
