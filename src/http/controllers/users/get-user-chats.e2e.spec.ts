import { app } from '@/app'
import { clearFireStore } from '@/utils/clearFireStore'
import { generateFakeJwt } from '@/utils/generate-fake-jwt'

import request from 'supertest'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get User Chats Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
    await clearFireStore()
  })

  afterAll(async () => {
    await app.close()
    await clearFireStore()
  })

  it('should be able to list user chats', async () => {
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

    await request(app.server)
      .post('/chats')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        participants: ['000076'],
      })

    const userChatsResponse = await request(app.server)
      .get('/users/user-chats')
      .set('Authorization', `Bearer ${token1}`)
      .send()

    expect(userChatsResponse.status).toEqual(200)
  })
})
