import { app } from '@/app'
import { clearFireStore } from '@/utils/clearFireStore'
import { generateFakeJwt } from '@/utils/generate-fake-jwt'

import request from 'supertest'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get User By Id Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
    await clearFireStore()
  })

  afterAll(async () => {
    await app.close()
    await clearFireStore()
  })

  it('should be able to get user by id', async () => {
    const token1 = generateFakeJwt({ sub: '000075' })

    await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        userName: 'John Doe',
        userMessage: 'test',
        avatarUrl: '123456',
      })

    const userChatsResponse = await request(app.server)
      .get('/users/000075')
      .set('Authorization', `Bearer ${token1}`)
      .send()

    expect(userChatsResponse.status).toEqual(200)
    expect(userChatsResponse.body.data.user).toEqual(
      expect.objectContaining({
        id: '000075',
        userName: 'John Doe',
      }),
    )
  })
})
