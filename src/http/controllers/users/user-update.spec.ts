import { app } from '@/app'
import { makeRegisterUserService } from '@/services/factories/make-register-user-service'
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
  })

  it('should be able to edit profile', async () => {
    const registerUserService = makeRegisterUserService()

    await registerUserService.execute({
      userName: 'John Doe',
      userMessage: 'johndoe@example.com',
      avatarUrl: '123456',
      documentId: '000076',
    })

    const token = generateFakeJwt({ sub: '000076' })

    const response = await request(app.server)
      .patch('/users/edit-user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userMessage: 'Maior de Minas',
      })

    expect(response.statusCode).toBe(200)
  })
})
