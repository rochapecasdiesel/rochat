import { app } from '@/app'
import { clearFireStore } from '@/utils/clearFireStore'
import { generateFakeJwt } from '@/utils/generate-fake-jwt'

import request from 'supertest'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create New Chat Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
    await clearFireStore()
  })

  afterAll(async () => {
    await app.close()
    await clearFireStore()
  })

  it('should be able to create a chat', async () => {
    const token1 = generateFakeJwt({ sub: '000075' })
    const token2 = generateFakeJwt({ sub: '000076' })

    await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        userName: 'john doe',
        userMessage: 'test',
        avatarUrl: '123456',
      })

    await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        userName: 'jane doe',
        userMessage: 'test',
        avatarUrl: '123456',
      })

    const chatResponse = await request(app.server)
      .post('/chats')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        participants: ['000076'],
      })

    expect(chatResponse.status).toBe(201)
  })
})
