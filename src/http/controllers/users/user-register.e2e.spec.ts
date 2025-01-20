import { app } from '@/app'
import { clearFireStore } from '@/utils/clearFireStore'
import { generateFakeJwt } from '@/utils/generate-fake-jwt'

import request from 'supertest'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register User Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
    await clearFireStore()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const token = generateFakeJwt({ sub: '000078' })

    const response = await request(app.server)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userName: 'John Doe',
        userMessage: 'johndoe@example.com',
        avatarUrl: '123456',
      })

    expect(response.statusCode).toBe(201)
  })
})
