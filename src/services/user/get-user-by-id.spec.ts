import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { describe, beforeEach, expect, it } from 'vitest'
import { GetUserByIdService } from './get-user-by-id.service'
import { RegisterUserService } from './register-user.service'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'

let userRepository: UsersRepository
let register: RegisterUserService
let sut: GetUserByIdService

describe('Get user Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new GetUserByIdService(userRepository)
    register = new RegisterUserService(userRepository)
  })

  it('should be able to get a user', async () => {
    await register.execute({
      documentId: '000075',
      userName: 'John Doe',
      avatarUrl: 'http://example.com/avatar.jpg',
      userMessage: 'Hello, world!',
    })

    const { user } = await sut.execute('000075')

    expect(user.userName).toEqual('John Doe')
  })

  it('should not be able to get a user', async () => {
    expect(sut.execute('000075')).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
