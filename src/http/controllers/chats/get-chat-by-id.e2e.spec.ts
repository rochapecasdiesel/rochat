import { app } from '@/app'
import { clearFireStore } from '@/utils/clearFireStore'
import { generateFakeJwt } from '@/utils/generate-fake-jwt'

import request from 'supertest'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get Chat By Id Controller (e2e)', () => {
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

    await request(app.server)
      .post(`/chats/${chatResponse.body.data.chat.id}/message`)
      .set('Authorization', `Bearer ${token1}`)
      .send({
        source: 'internal',
        recieverId: '000076',
        text: 'Hello, Jane!',
      })

    await request(app.server)
      .post(`/chats/${chatResponse.body.data.chat.id}/message`)
      .set('Authorization', `Bearer ${token2}`)
      .send({
        source: 'internal',
        recieverId: '000075',
        text: 'Hello, John!',
      })

    const response = await request(app.server)
      .get(`/chats/${chatResponse.body.data.chat.id}`)
      .set('Authorization', `Bearer ${token1}`)

    expect(response.status).toBe(200)
    expect(response.body.data.chat.lastMessage).equals('Hello, John!')
  })
})
