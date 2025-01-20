import { app } from '@/app'
import { clearFireStore } from '@/utils/clearFireStore'
import { generateFakeJwt } from '@/utils/generate-fake-jwt'

import request from 'supertest'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Update User Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
    await clearFireStore()
  })

  afterAll(async () => {
    await app.close()
    await clearFireStore()
  })

  it('should be able to get many users by name', async () => {
    const token1 = generateFakeJwt({ sub: '000075' })
    const token2 = generateFakeJwt({ sub: '000076' })

    await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        userName: 'Jane Doe',
        userMessage: 'test',
        avatarUrl: '123456',
      })

    await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        userName: 'John Doe',
        userMessage: 'test',
        avatarUrl: '123456',
      })

    const response = await request(app.server)
      .get('/users/')
      .set('Authorization', `Bearer ${token1}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.data.users).toHaveLength(2)
    expect(response.body.data.users[1].userName).toBe('John Doe')
    expect(response.body.data.users[0].userName).toBe('Jane Doe')
  })
})
